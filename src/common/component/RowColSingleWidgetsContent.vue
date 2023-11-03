<template>
  <div class="font-regular-bosch">
    <q-card flat class="bg-grey-3 q-custom-rounded-border">
      <div class="row text-center justify-center q-pl-md q-pr-md q-pt-md font-bold-bosch font-16">
        <div class="col-12">
          <slot name="title"></slot>
        </div>
      </div>

      <div class="row justify-between">
        <div class="col-12">
          <slot name="content">
          </slot>
        </div>
      </div>
    </q-card>
  </div>
</template>
