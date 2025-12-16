package com.mockInterview.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.Campaign;
import com.mockInterview.entity.Status;
import com.mockInterview.exception.DuplicateFieldException;
import com.mockInterview.exception.InactiveResourceException;
import com.mockInterview.exception.ResourceNotFoundException;
import com.mockInterview.repository.CampaignRepository;
import com.mockInterview.service.CampaignService;

@Service
public class CampaignServiceImpl implements CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    @Override
    public Campaign createCampaign(Campaign campaign) {
        if (campaignRepository.existsByCampaignName(campaign.getCampaignName())) {
            throw new DuplicateFieldException("Campaign name already exists");
        }
        return campaignRepository.save(campaign);
    }

    @Override
    public Campaign updateCampaign(Long id, Campaign campaign) {
        Campaign existing = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + id));

        // ❌ Cannot update INACTIVE campaign
        if (existing.getStatus() == Status.INACTIVE) {
            throw new InactiveResourceException("Inactive campaign cannot be updated");
        }

        // ❌ Check duplicate campaign name (excluding current campaign)
        if (!existing.getCampaignName().equalsIgnoreCase(campaign.getCampaignName())
                && campaignRepository.existsByCampaignName(campaign.getCampaignName())) {
            throw new DuplicateFieldException("Campaign name already exists");
        }

        existing.setCampaignName(campaign.getCampaignName());
        return campaignRepository.save(existing);
    }

    // 🔹 Activate / Inactivate Campaign
    @Override
    public Campaign updateCampaignStatus(Long id, Status status) {
        Campaign existing = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + id));

        existing.setStatus(status);
        return campaignRepository.save(existing);
    }

    @Override
    public String deleteCampaign(Long id) {
        Campaign existing = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + id));

        campaignRepository.delete(existing);
        return "Campaign deleted successfully";
    }

    @Override
    public Campaign getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + id));
    }

    @Override
    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAllByOrderByStatusAsc();
    }


    // 🔹 Get Only ACTIVE Campaigns
    @Override
    public List<Campaign> getActiveCampaigns() {
        return campaignRepository.findByStatus(Status.ACTIVE);
    }
}
