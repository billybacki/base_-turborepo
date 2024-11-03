'use client'
import NiceModal from '@ebay/nice-modal-react'
import React from 'react'

export class DialogControl<T extends Record<string, React.FC<any>>> {
  constructor(comps: T) {
    for (const key in comps) {
      if (Object.prototype.hasOwnProperty.call(comps, key)) {
        const Component = comps[key]
        if (Component) {
          NiceModal.register(key, NiceModal.create(Component))
        }
      }
    }
  }
  // Omit : Because use @ebay/nice-modal-react create modal need id
  public show<K extends keyof T>(key: K, arg?: Omit<React.ComponentProps<T[K]>, 'id'>) {
    return NiceModal.show<K>(key as string, arg)
  }
  // set no visible
  public hide<K extends keyof T>(key: K) {
    return NiceModal.hide(key as string)
  }
  // Delete from dom tree
  public remove<K extends keyof T>(key: K) {
    return NiceModal.remove(key as string)
  }
}
