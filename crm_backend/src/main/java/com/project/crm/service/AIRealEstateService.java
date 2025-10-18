package com.project.crm.service;

import com.project.crm.model.Property;
import com.project.crm.model.Customer;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AIRealEstateService {

    @Value("${ai.api.key:your-openai-api-key}")
    private String openAiApiKey;

    @Value("${ai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openAiApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIRealEstateService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Property analyzeProperty(Property property) {
        try {
            // Generate AI analysis for property
            String analysisPrompt = buildPropertyAnalysisPrompt(property);
            String aiResponse = callOpenAI(analysisPrompt);
            
            // Parse AI response and update property
            parsePropertyAnalysis(property, aiResponse);
            
        } catch (Exception e) {
            System.err.println("Error in AI property analysis: " + e.getMessage());
            // Set default values if AI fails
            property.setAiEstimatedValue(property.getPrice());
            property.setAiLeadScore(50);
            property.setAiMarketAnalysis("Analysis unavailable");
            property.setAiRecommendations("Contact agent for more information");
        }
        
        return property;
    }

    public Customer scoreLead(Customer customer, Property property) {
        try {
            String scoringPrompt = buildLeadScoringPrompt(customer, property);
            String aiResponse = callOpenAI(scoringPrompt);
            
            // Parse lead score from AI response
            int leadScore = parseLeadScore(aiResponse);
            
            // Update customer with AI insights (you might want to add these fields to Customer entity)
            // For now, we'll just return the score
            
        } catch (Exception e) {
            System.err.println("Error in AI lead scoring: " + e.getMessage());
        }
        
        return customer;
    }

    public String generateMarketAnalysis(String city, String state) {
        try {
            String marketPrompt = buildMarketAnalysisPrompt(city, state);
            return callOpenAI(marketPrompt);
        } catch (Exception e) {
            System.err.println("Error in AI market analysis: " + e.getMessage());
            return "Market analysis unavailable. Please contact your agent for current market information.";
        }
    }

    public String generatePropertyRecommendations(Customer customer, List<Property> properties) {
        try {
            String recommendationPrompt = buildRecommendationPrompt(customer, properties);
            return callOpenAI(recommendationPrompt);
        } catch (Exception e) {
            System.err.println("Error in AI recommendations: " + e.getMessage());
            return "Recommendations unavailable. Please contact your agent for personalized property suggestions.";
        }
    }

    private String callOpenAI(String prompt) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", Arrays.asList(
            Map.of("role", "system", "content", "You are a real estate AI assistant. Provide accurate, helpful analysis for real estate professionals."),
            Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("max_tokens", 1000);
        requestBody.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(openAiApiUrl, HttpMethod.POST, entity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("choices").get(0).get("message").get("content").asText();
    }

    private String buildPropertyAnalysisPrompt(Property property) {
        return String.format("""
            Analyze this real estate property and provide insights:
            
            Property Details:
            - Title: %s
            - Address: %s, %s, %s %s
            - Price: $%,.2f
            - Type: %s
            - Status: %s
            - Bedrooms: %d
            - Bathrooms: %d
            - Square Feet: %d
            - Description: %s
            - Features: %s
            - Amenities: %s
            
            Please provide:
            1. Estimated market value (just the number)
            2. Market analysis (2-3 sentences)
            3. Lead score (1-100, where 100 is highest interest)
            4. Recommendations for pricing and marketing (2-3 sentences)
            
            Format your response as JSON:
            {
                "estimatedValue": number,
                "marketAnalysis": "text",
                "leadScore": number,
                "recommendations": "text"
            }
            """,
            property.getTitle(),
            property.getAddress(),
            property.getCity(),
            property.getState(),
            property.getZipCode(),
            property.getPrice(),
            property.getPropertyType(),
            property.getStatus(),
            property.getBedrooms(),
            property.getBathrooms(),
            property.getSquareFeet(),
            property.getDescription(),
            property.getFeatures() != null ? property.getFeatures() : "None",
            property.getAmenities() != null ? property.getAmenities() : "None"
        );
    }

    private String buildLeadScoringPrompt(Customer customer, Property property) {
        return String.format("""
            Score this lead's interest level in this property:
            
            Customer Profile:
            - Name: %s %s
            - Email: %s
            - Phone: %s
            - Company: %s
            - Notes: %s
            
            Property Interest:
            - Property: %s
            - Price: $%,.2f
            - Type: %s
            - Location: %s, %s
            
            Rate their interest level from 1-100 based on:
            - Contact information completeness
            - Company/background
            - Property match with their profile
            - Communication history
            
            Respond with just the number (1-100).
            """,
            customer.getFirstName(),
            customer.getLastName(),
            customer.getEmail(),
            customer.getPhone() != null ? customer.getPhone() : "Not provided",
            customer.getCompany() != null ? customer.getCompany() : "Not provided",
            customer.getNotes() != null ? customer.getNotes() : "No notes",
            property.getTitle(),
            property.getPrice(),
            property.getPropertyType(),
            property.getCity(),
            property.getState()
        );
    }

    private String buildMarketAnalysisPrompt(String city, String state) {
        return String.format("""
            Provide a current real estate market analysis for %s, %s:
            
            Include:
            1. Current market trends (buyer's/seller's market)
            2. Average home prices and price trends
            3. Inventory levels and days on market
            4. Key factors affecting the market
            5. Predictions for the next 6 months
            
            Keep it concise but informative for real estate professionals.
            """,
            city, state
        );
    }

    private String buildRecommendationPrompt(Customer customer, List<Property> properties) {
        StringBuilder propertyList = new StringBuilder();
        for (Property prop : properties) {
            propertyList.append(String.format("- %s: $%,.2f, %s, %d bed/%d bath\n",
                prop.getTitle(), prop.getPrice(), prop.getPropertyType(),
                prop.getBedrooms(), prop.getBathrooms()));
        }

        return String.format("""
            Recommend properties for this customer:
            
            Customer Profile:
            - Name: %s %s
            - Company: %s
            - Notes: %s
            
            Available Properties:
            %s
            
            Provide 3-5 personalized recommendations with brief explanations of why each property matches their needs.
            """,
            customer.getFirstName(),
            customer.getLastName(),
            customer.getCompany() != null ? customer.getCompany() : "Not specified",
            customer.getNotes() != null ? customer.getNotes() : "No specific requirements",
            propertyList.toString()
        );
    }

    private void parsePropertyAnalysis(Property property, String aiResponse) {
        try {
            JsonNode jsonNode = objectMapper.readTree(aiResponse);
            
            if (jsonNode.has("estimatedValue")) {
                property.setAiEstimatedValue(new BigDecimal(jsonNode.get("estimatedValue").asDouble()));
            }
            if (jsonNode.has("marketAnalysis")) {
                property.setAiMarketAnalysis(jsonNode.get("marketAnalysis").asText());
            }
            if (jsonNode.has("leadScore")) {
                property.setAiLeadScore(jsonNode.get("leadScore").asInt());
            }
            if (jsonNode.has("recommendations")) {
                property.setAiRecommendations(jsonNode.get("recommendations").asText());
            }
        } catch (Exception e) {
            System.err.println("Error parsing AI response: " + e.getMessage());
            // Set default values
            property.setAiEstimatedValue(property.getPrice());
            property.setAiLeadScore(50);
            property.setAiMarketAnalysis("Analysis in progress");
            property.setAiRecommendations("Contact agent for details");
        }
    }

    private int parseLeadScore(String aiResponse) {
        try {
            // Extract number from response
            String numberStr = aiResponse.replaceAll("[^0-9]", "");
            if (!numberStr.isEmpty()) {
                int score = Integer.parseInt(numberStr);
                return Math.max(1, Math.min(100, score)); // Clamp between 1-100
            }
        } catch (Exception e) {
            System.err.println("Error parsing lead score: " + e.getMessage());
        }
        return 50; // Default score
    }
}
