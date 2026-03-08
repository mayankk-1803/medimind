import Swal from 'sweetalert2';

// Base style configuration for SweetAlert to match healthcare theme
const baseSwalConfig = {
  customClass: {
    confirmButton: 'bg-black hover:bg-[#2A2A2A] text-white font-medium rounded-xl px-6 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95',
    cancelButton: 'bg-transparent hover:bg-slate-50 text-black font-medium rounded-xl px-6 py-2.5 border border-black transition-all duration-200 active:scale-95 mr-3',
    popup: 'rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 bg-[#F8F4EC] dark:bg-slate-900',
    title: 'text-xl font-bold text-[#0F0F0F] dark:text-white',
    htmlContainer: 'text-[#4B4B4B] dark:text-gray-300',
  },
  showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  },
  buttonsStyling: false,
  background: '#F8F4EC',
  color: '#0F0F0F',
};

export const showSuccess = (title, text = '') => {
  return Swal.fire({
    ...baseSwalConfig,
    icon: 'success',
    title,
    text,
    timer: 2500,
    showConfirmButton: false,
    iconColor: '#22C55E', // Success theme
  });
};

export const showError = (title, text = '') => {
  return Swal.fire({
    ...baseSwalConfig,
    icon: 'error',
    title,
    text,
    iconColor: '#EF4444', // Emergency/Error theme
  });
};

export const showWarning = (title, text = '') => {
  return Swal.fire({
    ...baseSwalConfig,
    icon: 'warning',
    title,
    text,
    iconColor: '#F59E0B',
  });
};

export const showEmergency = (title, text = '') => {
  return Swal.fire({
    ...baseSwalConfig,
    icon: 'warning',
    title: `⚠️ ${title}`,
    text,
    iconColor: '#EF4444',
    background: '#F8F4EC', // Cream background
    customClass: {
      popup: 'border-l-4 border-[#EF4444] shadow-xl',
      confirmButton: 'bg-[#EF4444] hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg',
    }
  });
};

export const showConfirm = (title, text = '') => {
  return Swal.fire({
    ...baseSwalConfig,
    icon: 'question',
    title,
    text,
    iconColor: '#0F0F0F',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
  });
};
