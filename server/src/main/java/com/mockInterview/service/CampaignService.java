package com.mockInterview.service;

import java.util.List;
import com.mockInterview.entity.Campaign;
import com.mockInterview.entity.Status;

public interface CampaignService {

    Campaign createCampaign(Campaign campaign);

    Campaign updateCampaign(Long id, Campaign campaign);

   
    Campaign updateCampaignStatus(Long id, Status status);

   
    String deleteCampaign(Long id);

    Campaign getCampaignById(Long id);

    
    List<Campaign> getAllCampaigns();

    
    List<Campaign> getActiveCampaigns();
}
