package com.project.crm.repo;

import com.project.crm.model.Property;
import com.project.crm.model.PropertyType;
import com.project.crm.model.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    // Find properties by type
    List<Property> findByPropertyType(PropertyType propertyType);
    
    // Find properties by status
    List<Property> findByStatus(PropertyStatus status);
    
    // Find properties by city
    List<Property> findByCity(String city);
    
    // Find properties by state
    List<Property> findByState(String state);
    
    // Find properties by price range
    List<Property> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Find properties by bedrooms
    List<Property> findByBedrooms(Integer bedrooms);
    
    // Find properties by bathrooms
    List<Property> findByBathrooms(Integer bathrooms);
    
    // Find properties by square feet range
    List<Property> findBySquareFeetBetween(Integer minSqFt, Integer maxSqFt);
    
    // Complex search queries
    @Query("SELECT p FROM Property p WHERE " +
           "(:city IS NULL OR p.city = :city) AND " +
           "(:state IS NULL OR p.state = :state) AND " +
           "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:minBedrooms IS NULL OR p.bedrooms >= :minBedrooms) AND " +
           "(:minBathrooms IS NULL OR p.bathrooms >= :minBathrooms)")
    Page<Property> findPropertiesWithFilters(
        @Param("city") String city,
        @Param("state") String state,
        @Param("propertyType") PropertyType propertyType,
        @Param("status") PropertyStatus status,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("minBedrooms") Integer minBedrooms,
        @Param("minBathrooms") Integer minBathrooms,
        Pageable pageable
    );
    
    // Find properties by agent
    List<Property> findByAgentId(Long agentId);
    
    // Find featured properties (high AI lead score)
    @Query("SELECT p FROM Property p WHERE p.aiLeadScore >= :minScore ORDER BY p.aiLeadScore DESC")
    List<Property> findFeaturedProperties(@Param("minScore") Integer minScore);
    
    // Find properties with AI analysis
    @Query("SELECT p FROM Property p WHERE p.aiMarketAnalysis IS NOT NULL")
    List<Property> findPropertiesWithAIAnalysis();
    
    // Search by text (title, description, address)
    @Query("SELECT p FROM Property p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Property> searchProperties(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Get property statistics
    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = :status")
    Long countByStatus(@Param("status") PropertyStatus status);
    
    @Query("SELECT AVG(p.price) FROM Property p WHERE p.status = :status")
    BigDecimal getAveragePriceByStatus(@Param("status") PropertyStatus status);
    
    @Query("SELECT p.city, COUNT(p) FROM Property p GROUP BY p.city ORDER BY COUNT(p) DESC")
    List<Object[]> getPropertyCountByCity();
}
