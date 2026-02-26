export const logging = (req, res, next) => {
    res.on("finish", () => {
        console.log(
            `[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`,
        );
        if (
            req.method === "POST" ||
            req.method === "PUT" ||
            req.method === "PATCH"
        ) {
            console.log("Body:", req.body);
        }
    });
    next();
};
