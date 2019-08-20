import {Core as Uppy, AwsS3Multipart, Dashboard} from 'uppy'
import Portuguese from '@uppy/locales/lib/pt_BR'
import 'uppy/dist/uppy.css'
import {S3Client, S3, GetObjectCommand} from '@aws-sdk/client-s3-browser'

export default {
  data() {
    return {
      uppy: new Uppy({
        autoProceed: false,
        locale: Portuguese,
        meta: {
          folder: 'templates/'
        },
        restrictions: {
          maxFileSize: false, //uppy options
          maxNumberOfFiles: 30,
          minNumberOfFiles: 1,
          allowedFileTypes: false
        }
      }),
      s3: new S3({
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'AKIAQCZH45UORNS2NQ6Q',
          secretAccessKey: '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'
        }
      })
    }
  },
  methods: {

  },
  computed: {
    async test() {
      let img = null;

      await this.s3.getObject({Bucket: 'storage-chr', Key: 'undefined/ChibiNaruto.jpg'}, async (error, data) => {
        if (null === error) {
          //console.log(window.URL.createObjectURL(new Blob([data.Body], {type: data.ContentType})));
          let blob = await new Blob([data.Body], {type: data.ContentType});
          img = await window.URL.createObjectURL(blob);
        }
      });

      //console.log(img)

      return img
    }
  },
  mounted() {
    this.uppy.use(Dashboard, {
      inline: true,
      target: '#DashboardContainer',
      replaceTargetContent: true,
      showProgressDetails: true,
      hideUploadButton: true,
      note: 'Images and video only, 2–3 files, up to 1 MB',
      width: '100%',
      height: 350,
      metaFields: [
        {id: 'name', name: 'Name', placeholder: 'file name'},
        {id: 'caption', name: 'Caption', placeholder: 'describe what the image is about'}
      ],
      browserBackButtonClose: true
    }).use(AwsS3Multipart, {
      limit: 2,
      companionUrl: 'http://upload.z1lab.com.br'
    }).run();
  }
}
