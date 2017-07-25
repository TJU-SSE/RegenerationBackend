const router = require('koa-router')();

const ImgRepository = require('../orm/repository/imgRepository');
const NewsRepository = require('../orm/repository/newsRepository');
const Qiniu = require('../utils/qiniu');

router.get('/admin/index', async (ctx, next) => {
  let imgs = await ImgRepository.findAll();
  await ctx.render('index', {
    title: 'Regeneration',
    imgs: imgs
  })
});

router.post('/admin/save', async (ctx, next) => {
  let file = ctx.request.body.files.test;
  console.log(file);
  let timestamp = Date.parse(new Date());
  await new Promise((resolve, reject) => {
    Qiniu.uploadFile(timestamp, file.path, function () {
      resolve();
    });
  });
  ctx.redirect('/admin/index');
});

router.post('/admin/delete', async (ctx, next) => {
  let img_id = ctx.request.body.fields.id;
  await new Promise((resolve, reject) => {
    Qiniu.deleteFile(img_id, function () {
      resolve();
    });
  });
  ctx.redirect('/admin/index');
});

module.exports = router;
