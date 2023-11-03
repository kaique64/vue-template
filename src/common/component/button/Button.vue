<template>
	<q-btn
		:id="props.buttonId"
		:icon="props.buttonIcon"
		:class="`${checkBtnType()} ${props.buttonClass}`"
		:size="props.buttonSize"
		:label="props.buttonLabel"
		:icon-right="props.buttonIconRight"
		:loading="props.buttonLoading"
		:disable="props.buttonDisable"
		:ripple="false"
		:style="{
			color: props.labelColor
		}"
	>
		<slot name="default"></slot>
		<slot name="loading"></slot>
	</q-btn>
</template>

<script setup lang="ts">

const props = defineProps<{
	buttonId: string;
	buttonLabel?: string | number;
	buttonIcon?: string;
	buttonIconRight?: string;
	buttonClass?: string;
	buttonLoading?: boolean;
	buttonDisable?: boolean;
	buttonSize?: string;
	labelColor?: string;
	buttonType?: string;
}>();

// Check the button type

const checkBtnType = () => {
	return props.buttonType === "tertiary" ? "btn-tertiary" : "btn-general";
};
</script>

<style scoped lang="scss">
.btn-general {
	color: white;
	background-color: #2974a3;
	border-radius: 10px;
	box-shadow: none !important;

	&:hover {
		background-color: #0d5887;
	}

	&:active {
		background-color: #003a69;
	}
}
.btn-tertiary {
	color: white;
	background-color: white;
	border-radius: 10px;
	box-shadow: none !important;

	&:hover {
		color: white !important;
		background-color: #9ae5ff !important;
	}

	&:active {
		color: white !important;
		background-color: #80cbfa !important;
	}
}
</style>
