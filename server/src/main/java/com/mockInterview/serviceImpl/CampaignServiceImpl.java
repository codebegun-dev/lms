package com.mockInterview.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mockInterview.entity.Campaign;
import com.mockInterview.exception.DuplicateFieldException;
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

        Optional<Campaign> optional = campaignRepository.findById(id);

        if (!optional.isPresent()) {
            throw new ResourceNotFoundException("Campaign not found with ID: " + id);
        }

        Campaign existing = optional.get();
        existing.setCampaignName(campaign.getCampaignName());

        return campaignRepository.save(existing);
    }

    @Override
    public String deleteCampaign(Long id) {

        Optional<Campaign> optional = campaignRepository.findById(id);

        if (!optional.isPresent()) {
            throw new ResourceNotFoundException("Campaign not found with ID: " + id);
        }

        campaignRepository.delete(optional.get());
        return "Campaign deleted successfully";
    }

    @Override
    public Campaign getCampaignById(Long id) {

        Optional<Campaign> optional = campaignRepository.findById(id);

        if (!optional.isPresent()) {
            throw new ResourceNotFoundException("Campaign not found with ID: " + id);
        }

        return optional.get();
    }

    @Override
    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }
}
