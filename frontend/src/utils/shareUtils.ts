export const generateInviteCode = (groupId: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${groupId}-${timestamp}-${random}`;
};

export const generateInviteLink = (groupId: string, baseUrl?: string): string => {
  const code = generateInviteCode(groupId);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/invite/${code}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export const shareViaEmail = (
  groupName: string,
  inviteLink: string,
  email?: string
): void => {
  const subject = encodeURIComponent(`Join ${groupName} on Ajo`);
  const body = encodeURIComponent(
    `You've been invited to join ${groupName} on Ajo!\n\nClick here to join: ${inviteLink}\n\nAjo is a decentralized savings group platform powered by Stellar blockchain.`
  );
  const mailtoLink = email
    ? `mailto:${email}?subject=${subject}&body=${body}`
    : `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
};

export const shareViaTwitter = (groupName: string, inviteLink: string): void => {
  const text = encodeURIComponent(
    `Join ${groupName} on Ajo - a decentralized savings group platform! ${inviteLink}`
  );
  window.open(
    `https://twitter.com/intent/tweet?text=${text}`,
    '_blank',
    'width=550,height=420'
  );
};

export const shareViaWhatsApp = (groupName: string, inviteLink: string): void => {
  const text = encodeURIComponent(
    `Join ${groupName} on Ajo!\n\n${inviteLink}\n\nAjo is a decentralized savings group platform.`
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
};

export const shareViaTelegram = (groupName: string, inviteLink: string): void => {
  const text = encodeURIComponent(
    `Join ${groupName} on Ajo! ${inviteLink}`
  );
  window.open(`https://t.me/share/url?url=${inviteLink}&text=${text}`, '_blank');
};

export const shareViaWebShare = async (
  groupName: string,
  inviteLink: string
): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Join ${groupName} on Ajo`,
        text: `You've been invited to join ${groupName} on Ajo - a decentralized savings group platform!`,
        url: inviteLink,
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  }
  return false;
};

export const parseInviteCode = (code: string): { groupId: string } | null => {
  try {
    const parts = code.split('-');
    if (parts.length >= 1) {
      return { groupId: parts[0] };
    }
    return null;
  } catch (error) {
    console.error('Failed to parse invite code:', error);
    return null;
  }
};
