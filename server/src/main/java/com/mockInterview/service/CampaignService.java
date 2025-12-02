package com.mockInterview.service;

import java.util.List;
import com.mockInterview.entity.Campaign;

public interface CampaignService {

    Campaign createCampaign(Campaign campaign);

    Campaign updateCampaign(Long id, Campaign campaign);

    String deleteCampaign(Long id);

    Campaign getCampaignById(Long id);

    List<Campaign> getAllCampaigns();
}
