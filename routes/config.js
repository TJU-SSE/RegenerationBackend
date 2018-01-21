const router = require('koa-router')();

const ConfigRepository = require('../orm/repository/configRepository');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/admin/config');

router.get('/extraTitle', async (ctx, next) => {
    try {
        let extraTitle = await ConfigRepository.findOrCreateOne('extra_title');
        let content = extraTitle.content;
        if (content == null) content = '';
        let ret = {
            extraTitle: content
        };
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.post('/extraTitle', async (ctx, next) => {
    try {
        let content = ctx.request.body.content;
        if (!content) { ctx.response.body = ResponseService.createErrResponse('Content not found'); return; }
        await ConfigRepository.update('extra_title', content);
        let ret = 'success';
        ctx.response.body = ResponseService.createJSONResponse(ret);
    } catch (e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
