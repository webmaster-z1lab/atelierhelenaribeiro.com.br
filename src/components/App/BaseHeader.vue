<template>
  <base-header class="pb-6">
    <div class="row align-items-center py-4">
      <div class="col-lg-6 col-7">
        <h6 class="h2 text-white d-inline-block mb-0">{{$route.meta.subTitle}}</h6>
        <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
          <route-breadcrumb/>
        </nav>
      </div>
    </div>

    <slot></slot>
  </base-header>
</template>

<script>
  export default {
    name: "base-header-app"
  }
</script>
