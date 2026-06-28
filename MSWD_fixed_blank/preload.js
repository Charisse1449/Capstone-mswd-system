const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mswdAPI', {
  residents: {
    list: (search) => ipcRenderer.invoke('residents:list', search),
    get: (id) => ipcRenderer.invoke('residents:get', id),
    create: (data) => ipcRenderer.invoke('residents:create', data),
    update: (id, data) => ipcRenderer.invoke('residents:update', { id, data }),
    deactivate: (id) => ipcRenderer.invoke('residents:deactivate', id)
  },

  masterData: {
    categories: () => ipcRenderer.invoke('master:categories'),

    barangays: () => ipcRenderer.invoke('master:barangays'),
    createBarangay: (data) => ipcRenderer.invoke('barangays:create', data),
    updateBarangay: (id, data) => ipcRenderer.invoke('barangays:update', { id, data }),
    deactivateBarangay: (id) => ipcRenderer.invoke('barangays:deactivate', id),
    activateBarangay: (id) => ipcRenderer.invoke('barangays:activate', id)
  }
});