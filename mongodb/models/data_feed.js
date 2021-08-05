const feedSchema = new Schema({}, {strict: false}); // Allow for dynamic fields
const feed = mongoose.model('feed', feedSchema);
