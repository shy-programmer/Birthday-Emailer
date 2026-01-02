document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".birthday-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.querySelector(".username").value.trim();
        const email = document.querySelector(".email").value.trim();
        const birthday = document.querySelector(".birthday").value;

        if (!username || !email || !birthday) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch("/api/v1/birthday", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    birthday,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            alert("🎉 You have been successfully registered for birthday wishes!");
            form.reset();
        } catch (error) {
            console.error(error);
            alert(`${error}`);
        }
    });
});
