// 启用严格模式
'use strict';

// 防止XSS的基本函数
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 检测是否为移动设备
const isMobile = window.matchMedia("(max-width: 768px)").matches;

// 移动端菜单切换
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// 点击菜单项后自动收起菜单
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            menu.classList.add('hidden');
        }
    });
});

// 获取所有社交媒体图标
const socialIcons = document.querySelectorAll('.social-links a');
const qrCodes = {
    0: 'wechat-qr',
    1: 'feishu-qr',
    2: 'douyin-qr'
};

// 安全的URL检查函数
function isSafeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return ['http:', 'https:', 'weixin:'].includes(parsedUrl.protocol);
    } catch (e) {
        return false;
    }
}

if (isMobile) {
    // 移动端点击处理
    socialIcons.forEach((icon, index) => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            showQR(qrCodes[index]);
        });
    });

    function showQR(qrId) {
        // 隐藏所有二维码
        document.querySelectorAll('#wechat-qr, #feishu-qr, #douyin-qr').forEach(qr => {
            qr.style.opacity = '0';
        });
        // 显示选中的二维码
        document.getElementById(qrId).style.opacity = '1';
    }

    // 处理二维码点击事件
    function handleQRClick(event, imgSrc) {
        // 创建一个 canvas 元素
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // 设置 canvas 尺寸与图片相同
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 在 canvas 上绘制图片
            ctx.drawImage(img, 0, 0);
            
            try {
                // 尝试将图片转换为 base64
                const dataUrl = canvas.toDataURL('image/png');
                
                // 创建长按识别的链接
                const link = document.createElement('a');
                link.href = `weixin://dl/scan?qrcode=${encodeURIComponent(dataUrl)}`;
                link.click();
            } catch (error) {
                console.error('Error creating QR code link:', error);
            }
        };
        
        img.src = imgSrc;
    }
} else {
    // PC端悬停处理
    socialIcons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', () => {
            document.querySelectorAll('#wechat-qr, #feishu-qr, #douyin-qr').forEach(qr => {
                qr.style.opacity = '0';
            });
            document.getElementById(qrCodes[index]).style.opacity = '1';
        });
    });
}

// 防止点击劫持
if (window.self !== window.top) {
    window.top.location = window.self.location;
}

// 禁用右键菜单（可选）
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
