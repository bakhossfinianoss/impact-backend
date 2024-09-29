const Content = require('../insurance');

// Create new content
exports.updateContent = async (req, res) => {
    try {
        const { language, category, subCategory, ...updatedData } = req.body;

        // Find and update the document based on language, category, and subCategory
        const updatedContent = await Content.findOneAndUpdate(
            { language, category, subCategory },
            updatedData,
            { new: true }
        );

        if (!updatedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.status(200).json(updatedContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get content by language and category
exports.getContent = async (req, res) => {
    try {
        const content = await Content.find({
            language: req.params.language,
            category: req.params.category
        });
        res.status(200).json(content); // Sends the documents as a JSON response
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
