package com.project.crm.service;

import com.project.crm.model.Property;
import com.project.crm.model.PropertyType;
import com.project.crm.model.PropertyStatus;
import com.project.crm.repo.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private AIRealEstateService aiService;

    public Property createProperty(Property property) {
        // Analyze property with AI before saving
        property = aiService.analyzeProperty(property);
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property propertyDetails) {
        Optional<Property> optionalProperty = propertyRepository.findById(id);
        if (optionalProperty.isPresent()) {
            Property property = optionalProperty.get();
            
            // Update basic fields
            property.setTitle(propertyDetails.getTitle());
            property.setDescription(propertyDetails.getDescription());
            property.setPrice(propertyDetails.getPrice());
            property.setAddress(propertyDetails.getAddress());
            property.setCity(propertyDetails.getCity());
            property.setState(propertyDetails.getState());
            property.setZipCode(propertyDetails.getZipCode());
            property.setBedrooms(propertyDetails.getBedrooms());
            property.setBathrooms(propertyDetails.getBathrooms());
            property.setSquareFeet(propertyDetails.getSquareFeet());
            property.setPropertyType(propertyDetails.getPropertyType());
            property.setStatus(propertyDetails.getStatus());
            property.setImageUrl(propertyDetails.getImageUrl());
            property.setVirtualTourUrl(propertyDetails.getVirtualTourUrl());
            property.setFloorPlanUrl(propertyDetails.getFloorPlanUrl());
            property.setFeatures(propertyDetails.getFeatures());
            property.setAmenities(propertyDetails.getAmenities());
            
            // Re-analyze with AI
            property = aiService.analyzeProperty(property);
            
            return propertyRepository.save(property);
        }
        return null;
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Page<Property> getPropertiesWithFilters(
            String city, String state, PropertyType propertyType, PropertyStatus status,
            BigDecimal minPrice, BigDecimal maxPrice, Integer minBedrooms, Integer minBathrooms,
            int page, int size, String sortBy, String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return propertyRepository.findPropertiesWithFilters(
            city, state, propertyType, status, minPrice, maxPrice, minBedrooms, minBathrooms, pageable
        );
    }

    public Page<Property> searchProperties(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return propertyRepository.searchProperties(searchTerm, pageable);
    }

    public List<Property> getFeaturedProperties() {
        return propertyRepository.findFeaturedProperties(70); // Properties with AI score >= 70
    }

    public List<Property> getPropertiesByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    public List<Property> getPropertiesByType(PropertyType propertyType) {
        return propertyRepository.findByPropertyType(propertyType);
    }

    public List<Property> getPropertiesByStatus(PropertyStatus status) {
        return propertyRepository.findByStatus(status);
    }

    public List<Property> getPropertiesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return propertyRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Property> getPropertiesByAgent(Long agentId) {
        return propertyRepository.findByAgentId(agentId);
    }

    public List<Property> getPropertiesWithAIAnalysis() {
        return propertyRepository.findPropertiesWithAIAnalysis();
    }

    // Statistics methods
    public Long getPropertyCountByStatus(PropertyStatus status) {
        return propertyRepository.countByStatus(status);
    }

    public BigDecimal getAveragePriceByStatus(PropertyStatus status) {
        return propertyRepository.getAveragePriceByStatus(status);
    }

    public List<Object[]> getPropertyCountByCity() {
        return propertyRepository.getPropertyCountByCity();
    }

    // AI-powered methods
    public Property analyzePropertyWithAI(Long propertyId) {
        Optional<Property> optionalProperty = propertyRepository.findById(propertyId);
        if (optionalProperty.isPresent()) {
            Property property = optionalProperty.get();
            return aiService.analyzeProperty(property);
        }
        return null;
    }

    public String getMarketAnalysis(String city, String state) {
        return aiService.generateMarketAnalysis(city, state);
    }
}

