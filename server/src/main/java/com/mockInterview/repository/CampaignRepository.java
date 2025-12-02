package com.mockInterview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mockInterview.entity.Campaign;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    boolean existsByCampaignName(String campaignName);
}
