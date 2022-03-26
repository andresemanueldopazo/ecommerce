import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
const { window } = new JSDOM('<!DOCTYPE html>');
const domPurify = DOMPurify(window as unknown as Window);

export class TextUtils {
  public static sanitize(unsafeText: string): string {
    return domPurify.sanitize(unsafeText);
  }
}
