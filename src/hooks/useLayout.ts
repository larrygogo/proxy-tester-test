import {useContext} from 'react'
import {LayoutContextValue} from '@/context/types'
import {LayoutContext} from "@/context/LayoutContext";

export const useLayout = (): LayoutContextValue => useContext(LayoutContext)
