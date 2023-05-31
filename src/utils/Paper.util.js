import { removeHTMLTags } from './General.util';

const formatPaperDescription = text => {
    if (!text || typeof text !== 'string') return '';

    return text.replace('\n\n**Lay Summary**\n\nAbstract', '').replace('\n\n**Lay Summary**\n\n', '').trim();
};

const formatPaperIntro = text => {
    if (!text || typeof text !== 'string') return '';

    const stripped = formatPaperDescription(text);

    return removeHTMLTags(stripped, 'h4').trim();
};

export { formatPaperDescription, formatPaperIntro };
