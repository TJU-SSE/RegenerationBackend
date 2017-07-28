const LookbookService = require('./lookbookService');
const CampaignService = require('./campaignService');
const BrandingService = require('./brandingService');
const CooperationService = require('./cooperationService');
const DesignerRepository = require('../orm/repository/designerRepository');
const DesignerLookbookRepository = require('../orm/repository/designerLookbookRepository');
const DesignerCampaignRepository = require('../orm/repository/designerCampaignRepository');
const DesignerBrandingRepository = require('../orm/repository/designerBrandingRepository');
const DesignerCooperationRepository = require('../orm/repository/designerCooperationRepository');
const DesignerViewModel = require('../view_model/designer');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.findOne = async (filter) => {
    return await DesignerRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await DesignerRepository.findAllFilter(filter);
};

pub.getAllDesignerNames = async () => {
    let designers = await DesignerRepository.findAllNames();
    let ret = [];
    console.log(designers);
    for (let x in designers) {
        let designer = designers[x];
        let id = designer.get('id');
        let name = designer.get('name');
        ret.push({id:id, name:name});
    }
    return ret;
};

pub.create = async (key, localFile, name, identity, social, address, extraBiography, biography, rank) => {
    try {
        let designer = null;
        await Qiniu.uploadFile(key, localFile, async function (img) {
            designer = await DesignerRepository.create(name, identity, social, address, extraBiography, biography, rank, img);
        });
        let id = designer.get('id');
        return {id:id};
    } catch (e) {
        return e;
    }
};

pub.updateImg = async (designer, key, localFile) => {
    try {
        await Qiniu.uploadFile(key, localFile, async function (img) {
            await DesignerRepository.updateImg(designer, img);
        });
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.update = async (designer, name, identity, social, address, extraBiography, biography) => {
    try {
        await DesignerRepository.update(designer, name, identity, social, address, extraBiography, biography);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.delete = async (filter) => {
    try {
        await DesignerRepository.deleteOne(filter);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.createDesignerViewModel = async (designer) => {
    try {
        let id = designer.get('id');
        let name = designer.get('name');
        let identity = designer.get('identity');
        let social = designer.get('social');
        let address = designer.get('address');
        let extraBiography = designer.get('extraBiography');
        let biography = designer.get('biography');
        let rank = designer.get('rank');
        let viewcount = designer.get('viewcount');
        let img = await designer.getCoverImg();
        let img_id = img.get('id');
        let img_url = img.get('url');
        return DesignerViewModel.createDesigner(id, name, identity, social, address, extraBiography, biography, rank, viewcount, img_id, img_url);
    } catch (e) {
        return e;
    }
};

pub.createDesignersViewModel = async (designers, pageOffset, itemSize) => {
    try {
        let total = DesignerRepository.count();
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designers) {
            let designer = designers[x];
            let id = designer.get('id');
            let name = designer.get('name');
            let identity = designer.get('identity');
            let rank = designer.get('rank');
            let img = await designer.getCoverImg();
            let img_id = img.get('id');
            let img_url = img.get('url');
            list.push(DesignerViewModel.createDesignerBrief(id, name, identity, rank, img_id, img_url))
        }
        ret['designers'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

// pub.createArtistProduct = async (artist, product, rank) => {
//     try {
//         await ArtistProductRepository.create(artist, product, rank);
//         return 'success';
//     } catch (e) {
//         return e;
//     }
// };
//
// pub.createArtistProductsViewModel = async (artist, pageOffset, itemSize) => {
//     try {
//         let artistProducts = await ArtistProductRepository.getArtistProducts(artist);
//         let ret = { pageOffset: pageOffset, itemSize: itemSize, total: artistProducts.length };
//         let list = [];
//         for(let x = pageOffset * itemSize; x < artistProducts.length && x < pageOffset * itemSize + itemSize; x++ ) {
//             let artistProduct = artistProducts[x];
//             let artistProductId = artistProduct.get('id');
//             let rank = artistProduct.get('rank');
//             let productId = artistProduct.get('productId');
//             let product = await ProductRepository.findOne({id:productId});
//             let title = product.get('title');
//             let session = product.get('session');
//             let releaseTime = product.get('releaseTime');
//             let introduction = product.get('introduction');
//             let img = await product.getCoverImg();
//             let img_id = img.get('id');
//             let img_url = img.get('url');
//             list.push(ArtistViewModel.createArtistProducts(
//                 artistProductId, rank, productId, title, session, releaseTime, introduction, img_id, img_url)
//             );
//         }
//         ret['artistProducts'] = list;
//         return ret;
//     } catch (e) {
//         return e;
//     }
// };

pub.updateRanks = async (ranks) => {
    try {
        let designers = await DesignerRepository.findAll();
        for (let x in ranks) {
            let id = ranks[x].id;
            let rank = ranks[x].rank;
            for (let y in designers) {
                let designer = designers[y];
                if (designer.get('id') == id) {
                    console.log(designer.get('id')+'-'+id);
                    await DesignerRepository.updateRank(designer, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Lookbook  ****************************

pub.addLookbook = async (rank, designer, lookbook) => {
    try {
        let designerId = designer.get('id');
        let lookbookId = lookbook.get('id');
        await DesignerLookbookRepository.create(rank, designerId, lookbookId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteLookbook = async (designer, lookbook) => {
    try {
        let designerId = designer.get('id');
        let lookbookId = lookbook.get('id');
        await DesignerLookbookRepository.deleteOne({designerId: designerId, lookbookId: lookbookId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllLookbooks = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerLookbookRepository.count(id);
        let designerLookbooks = await DesignerLookbookRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerLookbooks) {
            let lookbookId = await designerLookbooks[x].get('lookbookId');
            let lookbook = await LookbookService.findOne({id:lookbookId});
            let lookbookViewModel = await LookbookService.createLookbookViewModel(lookbook);
            lookbookViewModel['rank'] = designerLookbooks[x].get('rank');
            list.push(lookbookViewModel);
        }
        ret['lookbooks'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateLookbookRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerLookbooks = await DesignerLookbookRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].lookbookId;
            let rank = ranks[x].rank;
            for (let y in designerLookbooks) {
                let designerLookbook = designerLookbooks[y];
                if (designerLookbook.get('lookbookId') == id) {
                    await DesignerLookbookRepository.update(designerLookbook, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Campaign  ****************************

pub.addCampaign = async (rank, designer, campaign) => {
    try {
        let designerId = designer.get('id');
        let campaignId = campaign.get('id');
        await DesignerCampaignRepository.create(rank, designerId, campaignId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteCampaign = async (designer, campaign) => {
    try {
        let designerId = designer.get('id');
        let campaignId = campaign.get('id');
        await DesignerCampaignRepository.deleteOne({designerId: designerId, campaignId: campaignId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllCampaigns = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerCampaignRepository.count(id);
        let designerCampaigns = await DesignerCampaignRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerCampaigns) {
            let campaignId = await designerCampaigns[x].get('campaignId');
            let campaign = await CampaignService.findOne({id:campaignId});
            let campaignViewModel = await CampaignService.createCampaignViewModel(campaign);
            campaignViewModel['rank'] = designerCampaigns[x].get('rank');
            list.push(campaignViewModel);
        }
        ret['campaigns'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateCampaignRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerCampaigns = await DesignerCampaignRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].campaignId;
            let rank = ranks[x].rank;
            for (let y in designerCampaigns) {
                let designerCampaign = designerCampaigns[y];
                if (designerCampaign.get('campaignId') == id) {
                    await DesignerLookbookRepository.update(designerCampaign, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Branding  ****************************

pub.addBranding = async (rank, designer, branding) => {
    try {
        let designerId = designer.get('id');
        let brandingId = branding.get('id');
        await DesignerBrandingRepository.create(rank, designerId, brandingId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteBranding = async (designer, branding) => {
    try {
        let designerId = designer.get('id');
        let brandingId = branding.get('id');
        await DesignerBrandingRepository.deleteOne({designerId: designerId, brandingId: brandingId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllBrandings = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerBrandingRepository.count(id);
        let designerBrandingss = await DesignerBrandingRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerBrandingss) {
            let brandingId = await designerBrandingss[x].get('brandingId');
            let branding = await BrandingService.findOne({id:brandingId});
            let brandingViewModel = await BrandingService.createBrandingViewModel(branding);
            brandingViewModel['rank'] = designerBrandingss[x].get('rank');
            list.push(brandingViewModel);
        }
        ret['brandings'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateBrandingRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerBrandings = await DesignerBrandingRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].brandingId;
            let rank = ranks[x].rank;
            for (let y in designerBrandings) {
                let designerBranding = designerBrandings[y];
                if (designerBranding.get('brandingId') == id) {
                    await DesignerLookbookRepository.update(designerBranding, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

// ****************************  Cooperation  ****************************

pub.addCooperation = async (rank, designer, cooperation) => {
    try {
        let designerId = designer.get('id');
        let cooperationId = cooperation.get('id');
        await DesignerCooperationRepository.create(rank, designerId, cooperationId);
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.deleteCooperation = async (designer, cooperation) => {
    try {
        let designerId = designer.get('id');
        let cooperationId = cooperation.get('id');
        await DesignerCooperationRepository.deleteOne({designerId: designerId, cooperationId: cooperationId});
        return 'success';
    } catch (e) {
        return e;
    }
};

pub.getAllCooperations = async (designer, pageOffset, itemSize) => {
    try {
        let id = designer.get('id');
        let total = await DesignerCooperationRepository.count(id);
        let designerCooperationss = await DesignerCooperationRepository.findAllFilter({'limit': itemSize, 'offset': pageOffset, where: {designerId: id}});
        let ret = { pageOffset: pageOffset, itemSize: itemSize, total: total };
        let list = [];
        for(let x in designerCooperationss) {
            let cooperationId = await designerCooperationss[x].get('cooperationId');
            let cooperation = await CooperationService.findOne({id:cooperationId});
            let cooperationViewModel = await CooperationService.createCooperationViewModel(cooperation);
            cooperationViewModel['rank'] = designerCooperationss[x].get('rank');
            list.push(cooperationViewModel);
        }
        ret['cooperations'] = list;
        return ret;
    } catch (e) {
        return e;
    }
};

pub.updateCooperationRanks = async (designer, ranks) => {
    try {
        let designerId = designer.get('id');
        let designerCooperations = await DesignerCooperationRepository.findAllFilter({where: {designerId: designerId}});
        for (let x in ranks) {
            let id = ranks[x].cooperationId;
            let rank = ranks[x].rank;
            for (let y in designerCooperations) {
                let designerCooperation = designerCooperations[y];
                if (designerCooperation.get('cooperationId') == id) {
                    await DesignerLookbookRepository.update(designerCooperation, rank);
                }
            }
        }
        return 'success';
    } catch (e) {
        return e;
    }
};

module.exports = pub;
