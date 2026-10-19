'use client';
import FooterView from './views/FooterView';
import { useLogic } from '@/lib/dc';
import FooterLogic from '@/lib/logic/Footer.logic';

export default function Footer() {
  const v = useLogic(FooterLogic, {});
  return <FooterView v={v} />;
}
