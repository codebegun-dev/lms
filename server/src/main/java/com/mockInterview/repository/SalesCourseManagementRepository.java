package com.mockInterview.repository;

import com.mockInterview.entity.SalesCourseManagement;
import jakarta.persistence.LockModeType;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesCourseManagementRepository extends JpaRepository<SalesCourseManagement, Long> {

    // ================= DUPLICATE CHECK =================
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    // ================= FETCH EMAILS / PHONES =================
    @Query("SELECT s.email FROM SalesCourseManagement s WHERE s.email IS NOT NULL")
    List<String> findAllEmails();

    @Query("SELECT s.phone FROM SalesCourseManagement s WHERE s.phone IS NOT NULL")
    List<String> findAllPhones();

    // ================= NEW & UNASSIGNED LEADS =================
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM SalesCourseManagement l WHERE l.status = 'NEW' AND l.assignedTo IS NULL")
    List<SalesCourseManagement> findNewUnassignedLeads();

    // ================= COUNT NEW LEADS BY USER =================
    @Query("SELECT COUNT(l) FROM SalesCourseManagement l WHERE l.assignedTo.userId = :userId AND l.status = 'NEW'")
    long countNewLeadsByUser(@Param("userId") Long userId);

    // ================= GET ALL LEADS =================
    @Query("SELECT l FROM SalesCourseManagement l")
    List<SalesCourseManagement> findAllLeads();

 // ================= GET ALL LEADS WITH PAGINATION =================
    @Query("SELECT l FROM SalesCourseManagement l ORDER BY l.createdDate DESC")
    Page<SalesCourseManagement> findAllLeadsPaginated(Pageable pageable);

    // ================= TOTAL LEADS COUNT =================
    @Query("SELECT COUNT(l) FROM SalesCourseManagement l")
    Long countAllLeads();

    // ================= STATUS WISE COUNT =================
    @Query("SELECT l.status, COUNT(l) FROM SalesCourseManagement l GROUP BY l.status")
    List<Object[]> countLeadsByStatus();

    // ================= ASSIGNED USER COUNT =================
    @Query("SELECT COUNT(DISTINCT l.assignedTo.userId) FROM SalesCourseManagement l WHERE l.assignedTo IS NOT NULL")
    Long countAssignedUsers();

 // ================= USER DASHBOARD METHODS =================
 // Leads assigned to a specific user with pagination
 @Query("SELECT l FROM SalesCourseManagement l WHERE l.assignedTo.userId = :userId ORDER BY l.createdDate DESC")
 Page<SalesCourseManagement> findLeadsByUserIdPaginated(@Param("userId") Long userId, Pageable pageable);

    // Status-wise count for a specific user
    @Query("SELECT l.status, COUNT(l) FROM SalesCourseManagement l WHERE l.assignedTo.userId = :userId GROUP BY l.status")
    List<Object[]> countLeadsByStatusForUser(@Param("userId") Long userId);

    // Total leads count for a specific user
    @Query("SELECT COUNT(l) FROM SalesCourseManagement l WHERE l.assignedTo.userId = :userId")
    Long countLeadsForUser(@Param("userId") Long userId);
    
    
    @Query("SELECT l FROM SalesCourseManagement l WHERE l.leadId IN :leadIds")
    List<SalesCourseManagement> findByLeadIds(@Param("leadIds") List<Long> leadIds);

    
    @Query("""
    	    SELECT l FROM SalesCourseManagement l
    	    WHERE l.assignedTo.userId = :userId
    	""")
    	List<SalesCourseManagement> findByAssignedUserId(@Param("userId") Long userId);

    
    
   
}
