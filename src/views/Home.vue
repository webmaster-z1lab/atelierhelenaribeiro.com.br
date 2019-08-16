<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Widgets</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb/>
          </nav>
        </div>
      </div>
      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card title="Total traffic"
                      type="gradient-red"
                      sub-title="350,897"
                      icon="ni ni-active-40">

            <template slot="footer">
              <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <stats-card title="Total traffic"
                      type="gradient-orange"
                      sub-title="2,356"
                      icon="ni ni-chart-pie-35">

            <template slot="footer">
              <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 12.18%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <stats-card title="Sales"
                      type="gradient-green"
                      sub-title="924"
                      icon="ni ni-money-coins">

            <template slot="footer">
              <span class="text-danger mr-2"><i class="fa fa-arrow-down"></i> 5.72%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>

        </div>
        <div class="col-xl-3 col-md-6">
          <stats-card title="Performance"
                      type="gradient-info"
                      sub-title="49,65%"
                      icon="ni ni-chart-bar-32">

            <template slot="footer">
              <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 54.8%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-lg-4">
          <!-- Image-Text card -->
          <div class="card">
            <!-- Card image -->
            <img class="card-img-top" src="img/theme/img-1-1000x900.jpg" alt="Image placeholder">
            <!-- Card body -->
            <div class="card-body">
              <h5 class="h2 card-title mb-0">Get started with Argon</h5>
              <small class="text-muted">by John Snow on Oct 29th at 10:23 AM</small>
              <p class="card-text mt-4">Argon is a great free UI package based on Bootstrap 4 that includes the most important components and features.</p>
              <a href="#!" class="btn btn-link px-0">View article</a>
            </div>
          </div>

          <!-- Messages -->
          <div class="card">
            <!-- Card header -->
            <div class="card-header">
              <!-- Title -->
              <h5 class="h3 mb-0">Latest messages</h5>
            </div>
            <!-- Card body -->
            <div class="card-body p-0">
              <!-- List group -->
              <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action flex-column align-items-start py-4 px-4">
                  <div class="d-flex w-100 justify-content-between">
                    <div>
                      <div class="d-flex w-100 align-items-center">
                        <img src="img/theme/team-1.jpg" alt="Image placeholder" class="avatar avatar-xs mr-2">
                        <h5 class="mb-1">Tim</h5>
                      </div>
                    </div>
                    <small>2 hrs ago</small>
                  </div>
                  <h4 class="mt-3 mb-1"> New order for Argon Dashboard</h4>
                  <p class="text-sm mb-0">Doasdnec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                </a>
                <a href="#" class="list-group-item list-group-item-action flex-column align-items-start py-4 px-4">
                  <div class="d-flex w-100 justify-content-between">
                    <div>
                      <div class="d-flex w-100 align-items-center">
                        <img src="img/theme/team-2.jpg" alt="Image placeholder" class="avatar avatar-xs mr-2">
                        <h5 class="mb-1">Mike</h5>
                      </div>
                    </div>
                    <small>1 day ago</small>
                  </div>
                  <h4 class="mt-3 mb-1"><span class="text-info">●</span> Your theme has been updated</h4>
                  <p class="text-sm mb-0">Doasdnec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
<!--          <uppy/>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard'
  //import Product from "@/models/Stock/Product";
  //import Uppy from './UppyComp'

  export default {
    name: 'home',
    components: {
      StatsCard,
      //Uppy
    },
    // computed: {
    //   test() {
    //     return Product.query().with('template').first()
    //   }
    // },
    // created() {
    //   Product.insert({
    //     data: [{
    //       "id":"5d52fe02dd04072594006907",
    //       "barcode":"St3OmMGQbOB6BgAE",
    //       "size":"m",
    //       "color":"branco",
    //       template_id: '5d4c7027dd04073060004f1b',
    //       "template": {
    //         "id":"5d4c7027dd04073060004f1b",
    //         "reference":"Y7NAXGOP",
    //         "price":1230,
    //         "is_active":false,
    //         "created_at":"2019-08-08T15:55:35-03:00",
    //         "images":[
    //           {
    //             "id":"5d4c7028dd04073060004f1d",
    //             "name":"Naruto-Uzumaki-Strong-Wallpaper-2880x1800",
    //             "extension":"webp",
    //             "path":"images\/Naruto-Uzumaki-Strong-Wallpaper-2880x1800.jpg",
    //             "icon":null,
    //             "size":null,
    //             "size_in_bytes":510784
    //           }
    //         ],
    //       },
    //       "price":2000,
    //       "images": [
    //         {
    //           "id":"5d52fe02dd04072594006908",
    //           "name":"ChibiNaruto",
    //           "extension":"webp",
    //           "path":"images\/chibinarutowebp",
    //           "icon":null,
    //           "size":null,
    //           "size_in_bytes":41736
    //         }
    //       ],
    //       "created_at":"2019-08-13T15:14:26-03:00"
    //     },
    //       {
    //         "id":"5d52fe02dd04072594006905",
    //         "barcode":"St3OmMGQbOB6BgAE",
    //         "size":"m",
    //         "color":"branco",
    //         template_id: '5d4c7027dd04073060004f11',
    //         "template": {
    //           "id":"5d4c7027dd04073060004f11",
    //           "reference":"Y7NAXGOP",
    //           "price":1230,
    //           "is_active":false,
    //           "created_at":"2019-08-08T15:55:35-03:00",
    //           "images":[
    //             {
    //               "id":"5d4c7028dd04073060004f1d",
    //               "name":"Naruto-Uzumaki-Strong-Wallpaper-2880x1800",
    //               "extension":"webp",
    //               "path":"images\/Naruto-Uzumaki-Strong-Wallpaper-2880x1800.jpg",
    //               "icon":null,
    //               "size":null,
    //               "size_in_bytes":510784
    //             }
    //           ],
    //         },
    //         "price":2000,
    //         "images": [
    //           {
    //             "id":"5d52fe02dd04072594006908",
    //             "name":"ChibiNaruto",
    //             "extension":"webp",
    //             "path":"images\/chibinarutowebp",
    //             "icon":null,
    //             "size":null,
    //             "size_in_bytes":41736
    //           }
    //         ],
    //         "created_at":"2019-08-13T15:14:26-03:00"
    //       }]
    //   }).then(res => console.log(res)).catch(err => console.log(err))
    // }
  };
</script>
