let pub = {};

pub.createDesigner = function (id, name, identity, social, address, extraBiography, biography, rank, viewcount, img_id, img_url) {
    console.log(id, name, identity, social, address, extraBiography, biography, rank, img_id, img_url);
    return {
        id: id,
        name: name,
        identity: identity,
        social: social,
        address: address,
        extraBiography: extraBiography,
        biography: biography,
        rank: rank,
        viewcount: viewcount,
        img_id: img_id,
        img_url: img_url
    };
};

pub.createDesignerBrief = function (id, name, identity, rank, img_id, img_url) {
    console.log(id, name, identity, img_id, img_url);
    return {
        id: id,
        name: name,
        identity: identity,
        rank: rank,
        img_id: img_id,
        img_url: img_url
    };
};

module.exports = pub;
