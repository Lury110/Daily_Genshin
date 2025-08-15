import React, { useEffect, useState, useCallback } from "react";

function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div style={styles.overlay} onMouseDown={onClose}>
            <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
                <button style={styles.close} onClick={onClose} aria-label="Fermer">
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

function useAuth(storageKey = "auth") {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed?.token) setToken(parsed.token);
                if (parsed?.user) setUser(parsed.user);
                return;
            } catch (_) {}
        }
        const legacyToken = localStorage.getItem("auth_token");
        const legacyUser = localStorage.getItem("auth_user");
        if (legacyToken) {
            try {
                const u = legacyUser ? JSON.parse(legacyUser) : null;
                localStorage.setItem(storageKey, JSON.stringify({ token: legacyToken, user: u }));
                setToken(legacyToken);
                setUser(u);
            } catch (_) {}
        }
    }, [storageKey]);

    const saveAuth = useCallback(
        (t, u) => {
            setToken(t || "");
            setUser(u || null);
            localStorage.setItem(storageKey, JSON.stringify({ token: t, user: u }));
        },
        [storageKey]
    );

    const clearAuth = useCallback(() => {
        setToken("");
        setUser(null);
        localStorage.removeItem(storageKey);
    }, [storageKey]);

    return { user, token, saveAuth, clearAuth };
}


export default function AuthModals({ apiBase = "/api/auth" }) {
    const { user, token, saveAuth, clearAuth } = useAuth();
    const [modal, setModal] = useState(null); // null | 'login' | 'register' | 'profile'
    const [notice, setNotice] = useState("");

    return (
        <div>
            {!user ? (
                <>
                    <p style={{cursor:"pointer"}} onClick={() => { setNotice(""); setModal("login"); }}>Connexion</p>
                </>
            ) : (
                <>
                    <p style={{cursor:"pointer"}} onClick={() => setModal("profile")}>{user.pseudo}</p>
                </>
            )}

            {/* Connexion */}
            <Modal open={modal === "login"} onClose={() => setModal(null)}>
                <LoginForm
                    apiBase={apiBase}
                    notice={notice}
                    onSuccess={(d) => {
                        saveAuth(d.token, d.user);
                        setModal("profile");
                        setNotice("");
                    }}
                    onSwitch={() => {
                        setNotice("");
                        setModal("register");
                    }}
                />
            </Modal>

            {/* Inscription */}
            <Modal open={modal === "register"} onClose={() => setModal(null)}>
                <RegisterForm
                    apiBase={apiBase}
                    onRegistered={(message) => {
                        setNotice(message || "Compte créé. Vous pouvez maintenant vous connecter.");
                        setModal("login");
                    }}
                    onSwitch={() => {
                        setNotice("");
                        setModal("login");
                    }}
                />
            </Modal>

            {/* Profil */}
            <Modal open={modal === "profile"} onClose={() => setModal(null)}>
                <ProfileView user={user} token={token} onLogout={() => { clearAuth(); setModal(null); }} />
            </Modal>
        </div>
    );
}

function Field({ label, type = "text", value, onChange, autoComplete, placeholder, required }) {
    return (
        <label style={styles.label}>
            <span style={{fontSize: "1rem"}}>{label}</span>
            <input
                style={styles.input}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required={required}
            />
        </label>
    );
}

function ErrorBox({ message }) {
    if (!message) return null;
    return <div style={styles.error}>{message + ": "}</div>;
}

function NoticeBox({ message }) {
    if (!message) return null;
    return <div>{message}</div>;
}

function LoginForm({ apiBase, onSuccess, onSwitch, notice }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Connexion impossible");
            if (!data?.token || !data?.user) throw new Error("Réponse inattendue du serveur");
            onSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form noValidate onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.h2}>Connexion</h2>
            <NoticeBox message={notice} />
            <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                placeholder="vous@exemple.com"
                required
            />
            <Field
                label="Mot de passe"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                placeholder="••••••••"
                required
            />
            <ErrorBox message={error} />
            <div>
                <button style={{ ...styles.input, cursor: "pointer", marginRight: "1rem" }} type="submit" disabled={loading}>
                    {loading ? "Connexion…" : "Se connecter"}
                </button>
                <button style={{ ...styles.input, cursor: "pointer" }} type="button" onClick={onSwitch} disabled={loading}>
                    Inscription
                </button>
            </div>
        </form>
    );
}

function RegisterForm({ apiBase, onRegistered, onSwitch }) {
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pseudo, email, password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Inscription impossible");

            onRegistered("Compte créé. Vous pouvez maintenant vous connecter.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form noValidate onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.h2}>Inscription</h2>
            <Field label="Pseudo" value={pseudo} onChange={setPseudo} placeholder="MonPseudo" required />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" required />
            <Field label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="Min. 8 caractères" required />
            <Field label="Confirmer le mot de passe" type="password" value={confirm} onChange={setConfirm} required />
            <ErrorBox message={error} />
            <div>
                <button style={{ ...styles.input, cursor: "pointer", marginRight: "1rem"}} type="submit" disabled={loading}>
                    {loading ? "Création…" : "Créer un compte"}
                </button>
                <button style={{ ...styles.input, cursor: "pointer" }} type="button" onClick={onSwitch} disabled={loading}>
                    Connexion
                </button>
            </div>
        </form>
    );
}

function ProfileView({ user, onLogout }) {
    return (
        <div>
            <h2 style={styles.h2}>Mon profil</h2>
            <p><strong>Pseudo</strong> : {user?.pseudo}</p>
            <p><strong>Email</strong> : {user?.email}</p>
            <div>
                <button onClick={onLogout} style={{ ...styles.input, cursor: "pointer" }}>Déconnexion</button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        minWidth: 320,
        maxWidth: 500,
        width: "100%",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        backgroundColor: "var(--grey)",
        border: "white 1px solid",
        borderRadius: "2rem",
    },
    close: {
        position: "absolute",
        top: 15,
        right: 20,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        lineHeight: 1,
        color: "white",
        fontSize: "1.5rem"
    },
    form: {
        backgroundColor: "var(--grey)",
        borderRadius: "2rem",
        color: "white",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
        gap: "1rem",
        border: "white 1px solid",
        padding: "1rem 0"
    },
    h2: {
        padding: "1rem",
        fontSize: "2rem",
        width: "100%",
    },
    input: {
        backgroundColor: "var(--grey)",
        border: "white 1px solid",
        borderRadius: "1rem",
        padding: ".5rem",
        color: "white"
    },
    label: {
        display: "flex",
        flexDirection: "column",
        marginBottom: ".5rem",
        width: "40%",
    },
    error: {
        color:"red",
        width:"100%",
        fontSize:"1.2rem"
    }
};
