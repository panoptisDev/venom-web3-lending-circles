import { createDeviceDetector } from "next-vue-device-detector"

function device() {
	var deviceProps = {
		type: createDeviceDetector(),
		size: 'desktop'
	}
	if(window.innerWidth <= 992) {
		deviceProps = {
			type: createDeviceDetector(),
			size: 'mobile'
		}
	}
	return deviceProps
}

export default device
