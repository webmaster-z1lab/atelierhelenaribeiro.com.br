<template>
  <div>
    <div id="DashboardContainer"></div>
  </div>
</template>
<script>
  import {Core as Uppy, AwsS3Multipart, Dashboard} from 'uppy'
  import Portuguese from '@uppy/locales/lib/pt_BR'
  import 'uppy/dist/uppy.css'
  import {S3Client, S3, GetObjectCommand} from '@aws-sdk/client-s3-browser'

  export default {
    name: 'upload-uppy',
    created() {
      const s3 = new S3({
          region: 'us-east-2',
          credentials: {
            accessKeyId: 'AKIAQCZH45UORNS2NQ6Q',
            secretAccessKey: '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'
          }
      });

      // s3.getObject({Bucket: 'storage-chr', Key: 'ChibiNaruto.jpg'}, (error, data) => {
      //   if (null === error) {
      //
      //     console.log(data, new Blob([data.Body], {type: data.ContentType}))
      //   } else {
      //     console.log(error)
      //   }
      // })

      s3.listObjectsV2({Bucket: 'storage-chr', Prefix: 'test/'}, (error, data) => {
        if (null === error) {
          console.log(data, 'list');
        } else {
          console.log(error, 'list')
        }
      })

      // const s3 = new S3Client({
      //   region: 'us-east-2',
      //   credentials: {
      //     accessKeyId: 'AKIAQCZH45UORNS2NQ6Q',
      //     secretAccessKey: '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'
      //   }
      // });
      //
      // const params = {
      //   Bucket: 'storage-chr',
      //   Key: 'ChibiNaruto.jpg',
      // };
      //
      // const getObjectCommand = new GetObjectCommand(params);
      //
      // s3.send(getObjectCommand).then(data => {
      //   console.log(data)
      // }).catch(error => {
      //   console.log(error)
      // })
    },
    mounted() {
      const uppy = new Uppy({
        autoProceed: false,
        locale: Portuguese,
        restrictions: {
          maxFileSize: false, //uppy options
          maxNumberOfFiles: 30,
          minNumberOfFiles: 1,
          allowedFileTypes: false
        }
      }).use(Dashboard, {
        trigger: '.UppyModalOpenerBtn',
        inline: true,
        target: '#DashboardContainer',
        replaceTargetContent: true,
        showProgressDetails: true,
        hideUploadButton: true,
        note: 'Images and video only, 2–3 files, up to 1 MB',
        height: 470,
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
  };
</script>
