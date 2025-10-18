package com.project.crm.dto;

import com.project.crm.model.PropertyType;
import com.project.crm.model.PropertyStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PropertyResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer squareFeet;
    private PropertyType propertyType;
    private PropertyStatus status;
    private String imageUrl;
    private String virtualTourUrl;
    private String floorPlanUrl;
    private String features;
    private String amenities;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // AI-generated fields
    private BigDecimal aiEstimatedValue;
    private String aiMarketAnalysis;
    private Integer aiLeadScore;
    private String aiRecommendations;

    // Constructors
    public PropertyResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public Integer getSquareFeet() { return squareFeet; }
    public void setSquareFeet(Integer squareFeet) { this.squareFeet = squareFeet; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getVirtualTourUrl() { return virtualTourUrl; }
    public void setVirtualTourUrl(String virtualTourUrl) { this.virtualTourUrl = virtualTourUrl; }

    public String getFloorPlanUrl() { return floorPlanUrl; }
    public void setFloorPlanUrl(String floorPlanUrl) { this.floorPlanUrl = floorPlanUrl; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public BigDecimal getAiEstimatedValue() { return aiEstimatedValue; }
    public void setAiEstimatedValue(BigDecimal aiEstimatedValue) { this.aiEstimatedValue = aiEstimatedValue; }

    public String getAiMarketAnalysis() { return aiMarketAnalysis; }
    public void setAiMarketAnalysis(String aiMarketAnalysis) { this.aiMarketAnalysis = aiMarketAnalysis; }

    public Integer getAiLeadScore() { return aiLeadScore; }
    public void setAiLeadScore(Integer aiLeadScore) { this.aiLeadScore = aiLeadScore; }

    public String getAiRecommendations() { return aiRecommendations; }
    public void setAiRecommendations(String aiRecommendations) { this.aiRecommendations = aiRecommendations; }
}

