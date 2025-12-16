package com.mockInterview.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mockInterview.entity.Campaign;
import com.mockInterview.entity.Status;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {

	boolean existsByCampaignName(String campaignName);

	List<Campaign> findByStatus(Status status);
	List<Campaign> findAllByOrderByStatusAsc();


}
