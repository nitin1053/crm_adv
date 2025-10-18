package com.project.crm.controller;

import com.project.crm.model.Property;
import com.project.crm.model.PropertyType;
import com.project.crm.model.PropertyStatus;
import com.project.crm.service.PropertyService;
import com.project.crm.dto.PropertyRequest;
import com.project.crm.dto.PropertyResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<Page<PropertyResponse>> getProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) PropertyStatus status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer minBathrooms,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Page<Property> properties = propertyService.getPropertiesWithFilters(
            city, state, propertyType, status, minPrice, maxPrice, 
            minBedrooms, minBathrooms, page, size, sortBy, sortDir
        );
        
        Page<PropertyResponse> response = properties.map(this::convertToResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PropertyResponse>> searchProperties(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Property> properties = propertyService.searchProperties(q, page, size);
        Page<PropertyResponse> response = properties.map(this::convertToResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PropertyResponse>> getFeaturedProperties() {
        List<Property> properties = propertyService.getFeaturedProperties();
        List<PropertyResponse> response = properties.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id)
            .map(property -> ResponseEntity.ok(convertToResponse(property)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<PropertyResponse> createProperty(@Valid @RequestBody PropertyRequest request) {
        Property property = convertToEntity(request);
        Property createdProperty = propertyService.createProperty(property);
        return ResponseEntity.ok(convertToResponse(createdProperty));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id, 
            @Valid @RequestBody PropertyRequest request) {
        Property property = convertToEntity(request);
        Property updatedProperty = propertyService.updateProperty(id, property);
        if (updatedProperty != null) {
            return ResponseEntity.ok(convertToResponse(updatedProperty));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Object> getPropertyStats() {
        Long forSale = propertyService.getPropertyCountByStatus(PropertyStatus.FOR_SALE);
        Long sold = propertyService.getPropertyCountByStatus(PropertyStatus.SOLD);
        Long forRent = propertyService.getPropertyCountByStatus(PropertyStatus.FOR_RENT);
        Long rented = propertyService.getPropertyCountByStatus(PropertyStatus.RENTED);
        
        BigDecimal avgSalePrice = propertyService.getAveragePriceByStatus(PropertyStatus.FOR_SALE);
        BigDecimal avgRentPrice = propertyService.getAveragePriceByStatus(PropertyStatus.FOR_RENT);
        
        List<Object[]> cityStats = propertyService.getPropertyCountByCity();
        
        return ResponseEntity.ok(new Object() {
            public final Long totalForSale = forSale;
            public final Long totalSold = sold;
            public final Long totalForRent = forRent;
            public final Long totalRented = rented;
            public final BigDecimal averageSalePrice = avgSalePrice;
            public final BigDecimal averageRentPrice = avgRentPrice;
            public final List<Object[]> cityStatistics = cityStats;
        });
    }

    @PostMapping("/{id}/analyze")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<PropertyResponse> analyzeProperty(@PathVariable Long id) {
        Property analyzedProperty = propertyService.analyzePropertyWithAI(id);
        if (analyzedProperty != null) {
            return ResponseEntity.ok(convertToResponse(analyzedProperty));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/market-analysis")
    public ResponseEntity<String> getMarketAnalysis(
            @RequestParam String city,
            @RequestParam String state) {
        String analysis = propertyService.getMarketAnalysis(city, state);
        return ResponseEntity.ok(analysis);
    }

    private Property convertToEntity(PropertyRequest request) {
        Property property = new Property();
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setSquareFeet(request.getSquareFeet());
        property.setPropertyType(request.getPropertyType());
        property.setStatus(request.getStatus());
        property.setImageUrl(request.getImageUrl());
        property.setVirtualTourUrl(request.getVirtualTourUrl());
        property.setFloorPlanUrl(request.getFloorPlanUrl());
        property.setFeatures(request.getFeatures());
        property.setAmenities(request.getAmenities());
        return property;
    }

    private PropertyResponse convertToResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        response.setId(property.getId());
        response.setTitle(property.getTitle());
        response.setDescription(property.getDescription());
        response.setPrice(property.getPrice());
        response.setAddress(property.getAddress());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setZipCode(property.getZipCode());
        response.setBedrooms(property.getBedrooms());
        response.setBathrooms(property.getBathrooms());
        response.setSquareFeet(property.getSquareFeet());
        response.setPropertyType(property.getPropertyType());
        response.setStatus(property.getStatus());
        response.setImageUrl(property.getImageUrl());
        response.setVirtualTourUrl(property.getVirtualTourUrl());
        response.setFloorPlanUrl(property.getFloorPlanUrl());
        response.setFeatures(property.getFeatures());
        response.setAmenities(property.getAmenities());
        response.setCreatedAt(property.getCreatedAt());
        response.setUpdatedAt(property.getUpdatedAt());
        response.setAiEstimatedValue(property.getAiEstimatedValue());
        response.setAiMarketAnalysis(property.getAiMarketAnalysis());
        response.setAiLeadScore(property.getAiLeadScore());
        response.setAiRecommendations(property.getAiRecommendations());
        return response;
    }
}

