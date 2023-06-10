import { ElNotification } from 'element-plus';

function notification(msg) {
    // console.log(msg);
    const title = (typeof msg.title != 'undefined') ? msg.title : '';
    const duration = (typeof msg.duration != 'undefined') ? msg.duration : 3000;
    const customClass = (typeof msg.customClass != 'undefined') ? `notification ${msg.customClass}` : 'notification w-auto';
    const dangerouslyUseHTMLString = (typeof msg.dangerouslyUseHTMLString != 'undefined') ? msg.dangerouslyUseHTMLString : false;
    const showClose = (typeof msg.showClose != 'undefined') ? msg.showClose : true;
    const onClose = (typeof msg.onClose != 'undefined') ? msg.onClose : null;
    ElNotification({
        title: title,
        message: msg.message,
        dangerouslyUseHTMLString: dangerouslyUseHTMLString,
        // grouping: true,
        type: msg.type,
        duration: duration,
        position: 'bottom-right',
        showClose: showClose,
        offset: 0,
        customClass: customClass,
        onClose: onClose,
    });
}

export default notification
