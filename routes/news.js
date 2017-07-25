const router = require('koa-router')();

const NewsService = require('../service/newsService');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/news');

router.get('/show', async (ctx, next) => {
    let news = await NewsService.findOne({id: 32});
    let ret = await NewsService.createNewsViewModel(news);
    await ctx.render('user_create', {news: ret});
});

router.get('/create', async (ctx, next) => {
    await ctx.render('user_create_one');
});

router.get('/getAll', async (ctx, next) => {
    try {
        let newses = await NewsService.findAll();
        let ret = await NewsService.createNewsesViewModel(newses);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/create', async (ctx, next) => {
    try {
        let file = ctx.request.body.files.img;
        let title = ctx.request.body.fields.title || '';
        let writer = ctx.request.body.fields.writer || '';
        let content = ctx.request.body.fields.content || '';
        let time = ctx.request.body.fields.time || '';
        let tags = ctx.request.body.fields.tags || [];
        let timestamp = Date.parse(new Date());
        let ret = await NewsService.create(timestamp, file.path, title, writer, content, time, tags);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.get('/select/:id', async (ctx, next) => {
    try {
        let id = ctx.params.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let news = await NewsService.findOne({id: id});
        if (!news) { ctx.response.body = ResponseService.createErrResponse('News not found'); return; }
        let ret = await NewsService.createNewsViewModel(news);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/updateImg',  async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let news = await NewsService.findOne({id: id});
        if (!news) { ctx.response.body = ResponseService.createErrResponse('News not found'); return; }
        let file = ctx.request.body.files.img;
        let timestamp = Date.parse(new Date());
        let ret = await NewsService.updateImg(news, timestamp, file.path);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/update', async (ctx, next) => {
    try {
        let id = ctx.request.body.fields.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let news = await NewsService.findOne({id: id});
        if (!news) { ctx.response.body = ResponseService.createErrResponse('News not found'); return; }
        let title = ctx.request.body.fields.title;
        let writer = ctx.request.body.fields.writer;
        let content = ctx.request.body.fields.content;
        let time = ctx.request.body.fields.time;
        let tags = ctx.request.body.fields.tags;
        let ret = await NewsService.update(news, title, writer, content, time, tags);
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

// OK
router.post('/delete', async (ctx, next) => {
    try {
        let id = ctx.request.body.id;
        if (!id) { ctx.response.body = ResponseService.createErrResponse('Id not found'); return; }
        let ret = await NewsService.delete({id: id});
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;

// x-www-form-urlencoded -> body.xx;
// multipart/form-data -> body.fields;
