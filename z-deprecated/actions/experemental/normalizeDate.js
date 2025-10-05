const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

export default normalizeDate