<template>
  <q-card class="cursor-pointer q-hoverable q-my-sm q-custom-rounded-border">
    <span class="q-focus-helper"></span>
    <div class="row">
      <div class="col-12">
        <q-card-section class="q-custom-card row justify-between font-12">
          <slot class="col-9" name="content-left"></slot>
          <slot class="col-2" name="content-right"></slot>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>