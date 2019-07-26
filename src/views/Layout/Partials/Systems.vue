<template>
  <li class="nav-item dropdown" :class="[{ show: isOpen }]">
    <a class="nav-link" href="javascript:;" role="button" data-toggle="dropdown" aria-haspopup="true" :aria-expanded="isOpen"
       @click="toggleDropDown" v-click-outside="closeDropDown">
      <i class="ni ni-ungroup"></i>
    </a>
    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-right" :class="[{ show: isOpen }]">
      <div class="row shortcuts px-4">
        <a href="#!" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-red">
                <i class="ni ni-calendar-grid-58"></i>
              </span>
          <small>Calendar</small>
        </a>
        <a href="#!" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-orange">
                <i class="ni ni-email-83"></i>
              </span>
          <small>Email</small>
        </a>
        <a href="#!" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                <i class="ni ni-credit-card"></i>
              </span>
          <small>Payments</small>
        </a>
        <a href="#!" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-green">
                <i class="ni ni-books"></i>
              </span>
          <small>Reports</small>
        </a>
        <a href="#!" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-purple">
                <i class="ni ni-pin-3"></i>
              </span>
          <small>Maps</small>
        </a>
        <a href="#!" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-yellow">
                <i class="ni ni-basket"></i>
              </span>
          <small>Shop</small>
        </a>
      </div>
    </div>
  </li>
</template>
<script>
  export default {
    name: 'systems',
    data() {
      return {
        isOpen: false
      };
    },
    methods: {
      toggleDropDown() {
        this.isOpen = !this.isOpen;
      },
      closeDropDown() {
        this.isOpen = false;
      }
    }
  };
</script>
