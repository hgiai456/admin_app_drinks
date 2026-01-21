const STORAGE_KEY = "loginAttempts";
const MAX_ATTEMPTS = 5;

// Thời gian chờ tăng dần (milliseconds)
const LOCKOUT_DURATIONS = [
  0.5 * 60 * 1000, //30 giây
  1 * 60 * 1000, // 1 phút
  5 * 60 * 1000, // 5 phút
  15 * 60 * 1000, // 15 phút
  30 * 60 * 1000, // 30 phút
  60 * 60 * 1000, // 1 giờ
  2 * 60 * 60 * 1000, // 2 giờ
];

//Lấy thông tin attempts từ localStorage
const getAttemptsData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        count: 0,
        lockoutUntil: null,
        lockoutLevel: 0,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error reading login attempts:", error);
    return {
      count: 0,
      lockoutUntil: null,
      lockoutLevel: 0,
    };
  }
};
//Lưu thông tin attempts vào localStorage
const saveAttemptsData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving login attempts:", error);
  }
};

//Kiểm tra tài khoản có đang bị khóa không ?
export const isLocked = () => {
  const attemptsData = getAttemptsData();

  if (!attemptsData.lockoutUntil) {
    return { locked: false, remainingTime: 0 };
  }

  const now = Date.now();
  const lockoutTime = new Date(attemptsData.lockoutUntil).getTime();

  if (now < lockoutTime) {
    return {
      locked: true,
      remainingTime: lockoutTime - now,
      lockoutLevel: attemptsData.lockoutLevel,
    };
  }
  //Hết thời gian khóa, mở khóa tài khoản
  saveAttemptsData({
    count: 0,
    lockoutUntil: null,
    lockoutLevel: attemptsData.lockoutLevel,
  });

  return { locked: false, remainingTime: 0 };
};

//Ghi lai lần đăng nhập thất bại
export const recordFailedAttempt = () => {
  const attemptsData = getAttemptsData();
  const newCount = attemptsData.count + 1;

  if (newCount >= MAX_ATTEMPTS) {
    //Tinh lockout level bắt đầu từ 0
    const currentLockoutLevel = attemptsData.lockoutLevel;

    let durationIndex = currentLockoutLevel;
    if (currentLockoutLevel <= 1) {
    }

    const lockoutDuration = LOCKOUT_DURATIONS[currentLockoutLevel];
    const lockoutUntil = new Date(Date.now() + lockoutDuration);

    saveAttemptsData({
      count: 0,
      lockoutUntil: lockoutUntil.toISOString(),
      lockoutLevel: currentLockoutLevel + 1,
    });

    return {
      locked: true,
      remainingTime: 0,
      lockoutDuration: lockoutDuration,
      lockoutLevel: currentLockoutLevel + 1,
    };
  }

  saveAttemptsData({
    ...attemptsData,
    count: newCount,
  });
  return { locked: false, remainingAttempts: MAX_ATTEMPTS - newCount };
};

//Reset khi đăng nhập thành công

export const resetAttempts = () => {
  saveAttemptsData({
    count: 0,
    lockoutUntil: null,
    lockoutLevel: 0,
  });
};

//Lấy số lần còn lại
export const getRemainingAttempts = () => {
  const attemptsData = getAttemptsData();
  return Math.max(0, MAX_ATTEMPTS - attemptsData.count);
};

//Format thời gian chờ
export const formatLockoutTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours} giờ ${remainingMinutes} phút`;
  }
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds > 0 ? remainingSeconds + " giây" : ""} `;
  }
  return `${seconds} giây`;
};

//Lấy thông tin lockout level
export const getLockoutLevelInfo = (level) => {
  const message = [
    "Lần khóa thứ 1",
    "Lần khóa thứ 2",
    "Lần khóa thứ 3",
    "Lần khóa thứ 4",
    "Lần khóa thứ 5",
    "Lần khóa thứ 6",
    "Lần khóa thứ 7+",
  ];

  return {
    level: level,
    message: message[Math.min(level, message.length - 1)],
    duration: LOCKOUT_DURATIONS[Math.min(level, LOCKOUT_DURATIONS.length - 1)],
  };
};
