const Designer = require('../model/designer');
const Qiniu = require('../../utils/qiniu');

let pub = {};

pub.findAll = async () => {
    let res = await Designer.findAll();
    return res;
};

pub.findAllFilter = async (filter) => {
    let res = await Designer.findAll(filter);
    return res;
};

pub.findOne = async (filter) => {
    let res = await Designer.findOne({where: filter});
    if (res) {
        res.viewcount += 1;
        res.save();
    }
    return res;
};

pub.count = async  () => {
    return await Designer.count();
};

pub.create = async (name, identity, social, address, extraBiography, biography, rank, img) =>{
    let designer = await Designer.create({ name: name, identity: identity, social: social, address: address, extraBiography: extraBiography, biography: biography, rank: rank, viewcount: 0 });
    designer.setCoverImg(img);
    return designer;
};

pub.updateImg = async (designer, img) => {
    let oldImg = await designer.getCoverImg();
    await Qiniu.deleteFile(oldImg);
    designer.setCoverImg(img);
};

pub.update = async (designer, name, identity, social, address, extraBiography, biography, rank) => {
    if(name) designer.name = name;
    if(identity) designer.identity = identity;
    if(social) designer.social = social;
    if(address) designer.address = address;
    if(extraBiography) designer.extraBiography = extraBiography;
    if(biography) designer.biography = biography;
    if(rank) designer.rank = rank;
    await designer.save();
};

pub.updateRank = async (designer, rank) => {
    if(rank) designer.rank = rank;
    await designer.save();
};



pub.deleteOne = async (filter) => {
    let designer = await pub.findOne(filter);
    if (designer) {
        let img = await designer.getCoverImg();
        await Qiniu.deleteFile(img);
        // let articleProducts = await ArtistProductRepository.getArtistProducts(artist);
        // for (let x in articleProducts) {
        //     let articleProduct = articleProducts[x];
        //     await ArtistProductRepository.delete(articleProduct);
        // }
        await designer.destroy();
    }
};

module.exports = pub;
