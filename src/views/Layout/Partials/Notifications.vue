<template>
  <li class="nav-item dropdown" :class="[{ show: isOpen }]">
    <a class="nav-link" href="javascript:;" role="button" data-toggle="dropdown" aria-haspopup="true" :aria-expanded="isOpen"
       @click="toggleDropDown" v-click-outside="closeDropDown">
      <i class="ni ni-bell-55"></i>
    </a>
    <div class="dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden" :class="[{ show: isOpen }]">
      <!-- Dropdown header -->
      <div class="px-3 py-3">
        <h6 class="text-sm text-muted m-0">You have <strong class="text-primary">13</strong>
          notifications.</h6>
      </div>
      <!-- List group -->
      <div class="list-group list-group-flush">
        <a href="javascript:;" class="list-group-item list-group-item-action">
          <div class="row align-items-center">
            <div class="col-auto">
              <!-- Avatar -->
              <img alt="Image placeholder" src="img/theme/team-4.jpg" class="avatar rounded-circle">
            </div>
            <div class="col ml--2">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="mb-0 text-sm">John Snow</h4>
                </div>
                <div class="text-right text-muted">
                  <small>2 hrs ago</small>
                </div>
              </div>
              <p class="text-sm mb-0">Let's meet at Starbucks at 11:30. Wdyt?</p>
            </div>
          </div>
        </a>
        <a href="javascript:;" class="list-group-item list-group-item-action">
          <div class="row align-items-center">
            <div class="col-auto">
              <!-- Avatar -->
              <img alt="Image placeholder" src="img/theme/team-5.jpg" class="avatar rounded-circle">
            </div>
            <div class="col ml--2">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="mb-0 text-sm">John Snow</h4>
                </div>
                <div class="text-right text-muted">
                  <small>3 hrs ago</small>
                </div>
              </div>
              <p class="text-sm mb-0">A new issue has been reported for Argon.</p>
            </div>
          </div>
        </a>
      </div>
      <!-- View all -->
      <a href="javascript:;" class="dropdown-item text-center text-primary font-weight-bold py-3">View all</a>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'notifications',
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
