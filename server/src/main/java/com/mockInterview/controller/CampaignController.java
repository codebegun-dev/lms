package com.mockInterview.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mockInterview.entity.Campaign;
import com.mockInterview.security.annotations.ModulePermission;
import com.mockInterview.service.CampaignService;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@ModulePermission("CAMPAIGN_MANAGEMENT")
@CrossOrigin(origins = "*")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    // CREATE
    @PreAuthorize("hasAuthority('CREATE_CAMPAIGN')")
    @PostMapping
    public Campaign createCampaign(@RequestBody Campaign campaign) {
        return campaignService.createCampaign(campaign);
    }

    // UPDATE
    @PreAuthorize("hasAuthority('UPDATE_CAMPAIGN')")
    @PutMapping("/{id}")
    public Campaign updateCampaign(@PathVariable Long id, @RequestBody Campaign campaign) {
        return campaignService.updateCampaign(id, campaign);
    }

    // DELETE
    @PreAuthorize("hasAuthority('DELETE_CAMPAIGN')")
    @DeleteMapping("/{id}")
    public String deleteCampaign(@PathVariable Long id) {
        return campaignService.deleteCampaign(id);
    }

    // GET BY ID
    @PreAuthorize("hasAuthority('VIEW_CAMPAIGN')")
    @GetMapping("/{id}")
    public Campaign getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id);
    }

    // GET ALL
    @PreAuthorize("hasAuthority('VIEW_CAMPAIGN')")
    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }
}
