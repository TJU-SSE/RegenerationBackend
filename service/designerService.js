const DesignerRepository = require('../orm/repository/designerRepository');
const DesignerViewModel = require('../view_model/designer');
const Qiniu = require('../utils/qiniu');

let pub = {};

pub.findOne = async (filter) => {
    return await DesignerRepository.findOne(filter);
};

pub.findAllFilter = async (filter) => {
    return await DesignerRepository.findAllFilter(filter);
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

pub.updateRanks = async (designers, ranks) => {
    try {
        for (let x in ranks) {
            let id = ranks[x].id;
            let rank = ranks[x].rank;
            for (let y in designers) {
                let designer = designers[y];
                if (designer.get('id') == id) {
                    await DesignerRepository.updateRank(designer, rank);
                }
            }
        }
    } catch (e) {
        return e;
    }
};

// pub.deleteArtistProduct = async (artistProduct) => {
//     try {
//         await ArtistProductRepository.delete(artistProduct);
//         return 'success';
//     } catch (e) {
//         return e;
//     }
// };

module.exports = pub;
