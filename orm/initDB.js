const Img = require('./model/img');
const Portfolio = require('./model/portfolio');
const PortfolioImg = require('./model/portfolioImg');
const Lookbook = require('./model/lookbook');
const Campaign = require('./model/campaign');
const Branding = require('./model/branding');
const Cooperation = require('./model/cooperation');
const Designer = require('./model/designer');









const News = require('./model/news');
const Session = require('./model/session');
const Test = require('./model/test');
const User = require('./model/user');
const Product = require('./model/product');
const ProductImg = require('./model/productImg');
const Artist = require('./model/artist');
const ArtistProduct = require('./model/atristProduct');
const IndexImg = require('./model/indexImg');
const NewsTag = require('./model/newsTag');
const Tag = require('./model/tag');

function syncAll() {

    Img.sync().then(function () {
        console.log("create Img success");
    });

    Portfolio.sync().then(function () {
        console.log("create Portfolio success");
    });

    PortfolioImg.sync().then(function () {
        console.log("create PortfolioImg success");
    });

    Lookbook.sync().then(function () {
        console.log("create Lookbook success");
    });

    Campaign.sync().then(function () {
        console.log("create Campaign success");
    });

    Branding.sync().then(function () {
        console.log("create Branding success");
    });

    Cooperation.sync().then(function () {
        console.log("create Cooperation success");
    });

    Designer.sync().then(function () {
        console.log("create Designer success");
    });

    News.sync().then(function () {
        console.log("create news success");
    });

    Session.sync().then(function () {
        console.log("create session success");
    });

    Test.sync().then(function () {
        console.log("create test success");
    });

    User.sync().then(function () {
        console.log("create user success");
    });

    ArtistProduct.sync().then(function () {
        console.log("create artist_product success");
    });

    ProductImg.sync().then(function () {
        console.log("create product_img success");
    });

    Product.sync().then(function () {
        console.log("create product success");
    });

    Artist.sync().then(function () {
        console.log("create artist success");
    });

    IndexImg.sync().then(function () {
        console.log("create index_img success");
    });

    Tag.sync().then(function () {
        console.log("create tag success");
    });

    NewsTag.sync().then(function () {
        console.log("create news_tag success");
    });
}

let init = function () {

    // Img.hasOne(News, { foreignKey: 'cover_img' });
    // Img.hasOne(News, { foreignKey: 'cover_img'});

    Portfolio.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    PortfolioImg.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Portfolio.hasMany(PortfolioImg, {as: 'PortfolioImgs'});
    Lookbook.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Campaign.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Cooperation.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Branding.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'Portfolio'});
    Designer.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});

    News.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    ProductImg.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    Product.hasMany(ProductImg, {as: 'ProductImgs'});
    Product.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Artist.hasMany(ArtistProduct, {as: 'ArtistProducts'});
    Artist.belongsTo(Img, { foreignKey: 'cover_img', as: 'coverImg'});
    IndexImg.belongsTo(News, { foreignKey: 'news_id', as: 'news'});
    News.hasMany(NewsTag, {as: 'NewsTags'});
    Tag.hasMany(NewsTag, {as: 'NewsTags'});
    syncAll();
};


module.exports = init;

// 标题、时间、作者、正文、封面图片、TAG