<template>
  <footer class="footer px-4 mx-2">
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-6">
        <div class="copyright text-center text-lg-left text-muted">
          © {{year}} Confecção Helena Ribeiro
        </div>
      </div>
      <div class="col-lg-6">
        <ul class="nav nav-footer justify-content-center justify-content-lg-end">
          <li class="nav-item">
            <a href="https://z1lab.com.br" class="nav-link" target="_blank">
              <img src="https://d35c048n9fix3e.cloudfront.net/images/z1lab/logo/powered_by_black.svg" alt="z1lab - Soluções Digitais" height="30px">
            </a>
          </li>
          <li class="nav-item">
            <a href="https://z1lab.com.br" class="nav-link" target="_blank">Suporte</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    name: 'footer',
    data() {
      return {
        year: new Date().getFullYear()
      };
    }
  };
</script>
<style></style>
