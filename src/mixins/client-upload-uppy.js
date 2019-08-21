import {Core as Uppy, AwsS3Multipart, Dashboard} from 'uppy'
import Portuguese from '@uppy/locales/lib/pt_BR'
import 'uppy/dist/uppy.css'

export default {
  data() {
    return {
      uppy: new Uppy({
        autoProceed: false,
        locale: Portuguese,
        restrictions: {
          maxFileSize: false,
          maxNumberOfFiles: 30,
          minNumberOfFiles: 1,
          allowedFileTypes: false
        }
      })
    }
  },
  mounted() {
    this.uppy.use(Dashboard, {
      inline: true,
      target: '#DashboardContainer',
      replaceTargetContent: true,
      showProgressDetails: true,
      proudlyDisplayPoweredByUppy: false,
      hideUploadButton: true,
      note: 'Images and video only, 2–3 files, up to 1 MB',
      width: '100%',
      height: 250,
      browserBackButtonClose: true
    }).use(AwsS3Multipart, {
      limit: 2,
      companionUrl: process.env.VUE_APP_AWS_COMPNAION_URL
    }).run();
  }
}
