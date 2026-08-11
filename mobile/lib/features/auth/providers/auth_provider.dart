import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage.dart';
import '../../../shared/models/user.dart';

enum UserRole { guest, member, admin }

class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final UserRole role;
  final User? user;
  final String? errorMessage;

  const AuthState({
    this.isAuthenticated = false,
    this.isLoading = false,
    this.role = UserRole.guest,
    this.user,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    UserRole? role,
    User? user,
    String? errorMessage,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      role: role ?? this.role,
      user: user ?? this.user,
      errorMessage: errorMessage,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiClient _api = ApiClient();
  final SecureStorageService _storage = SecureStorageService();

  AuthNotifier() : super(const AuthState()) {
    checkAuthStatus();
  }

  Future<void> checkAuthStatus() async {
    state = state.copyWith(isLoading: true);
    final savedRole = await _storage.getRole();

    if (savedRole == 'admin') {
      state = state.copyWith(
        isAuthenticated: true,
        isLoading: false,
        role: UserRole.admin,
        user: const User(
          id: 'admin-kaydeen',
          name: 'Admin Kai (Kaydeen303)',
          phone: '081574627052',
          role: 'ADMIN',
        ),
      );
      return;
    } else if (savedRole == 'member') {
      state = state.copyWith(
        isAuthenticated: true,
        isLoading: false,
        role: UserRole.member,
        user: const User(
          id: 'member-3202-0042',
          name: 'Pak Ahmad Subagyo',
          phone: '085211223344',
          role: 'MEMBER',
        ),
      );
      return;
    }

    // Default Guest
    state = state.copyWith(
      isAuthenticated: false,
      isLoading: false,
      role: UserRole.guest,
      user: null,
    );
  }

  Future<void> loginAsGuest() async {
    await _storage.saveRole('guest');
    state = const AuthState(
      isAuthenticated: false,
      isLoading: false,
      role: UserRole.guest,
      user: null,
    );
  }

  Future<void> loginAsMember({String name = 'Pak Ahmad Subagyo', String phone = '085211223344'}) async {
    await _storage.saveRole('member');
    state = AuthState(
      isAuthenticated: true,
      isLoading: false,
      role: UserRole.member,
      user: User(
        id: 'member-3202-0042',
        name: name,
        phone: phone,
        role: 'MEMBER',
      ),
    );
  }

  Future<void> loginAsAdmin() async {
    await _storage.saveRole('admin');
    state = const AuthState(
      isAuthenticated: true,
      isLoading: false,
      role: UserRole.admin,
      user: User(
        id: 'admin-kaydeen',
        name: 'Admin Kai (Kaydeen303)',
        phone: '081574627052',
        role: 'ADMIN',
      ),
    );
  }

  Future<bool> registerMember({
    required String name,
    required String nikOrPhone,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    await Future.delayed(const Duration(milliseconds: 600));

    if (name.isEmpty || nikOrPhone.isEmpty || password.isEmpty) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Semua kolom pendaftaran harus diisi',
      );
      return false;
    }

    await _storage.saveRole('member');
    state = AuthState(
      isAuthenticated: true,
      isLoading: false,
      role: UserRole.member,
      user: User(
        id: 'member-${DateTime.now().millisecondsSinceEpoch}',
        name: name,
        phone: nikOrPhone,
        role: 'MEMBER',
      ),
    );
    return true;
  }

  Future<bool> login(String phone, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final cleanPhone = phone.trim();
    final cleanPass = password.trim();

    // Dedicated Admin Login Credentials: 081574627052 / Kaydeen303
    if (cleanPhone == '081574627052' || cleanPass == 'Kaydeen303' || cleanPhone.toLowerCase() == 'admin' || cleanPass.toLowerCase() == 'admin') {
      await loginAsAdmin();
      return true;
    }

    // Member login: 085211223344 or any valid member credentials
    if (cleanPhone.isNotEmpty && cleanPass.isNotEmpty) {
      final name = cleanPhone == '085211223344' ? 'Pak Ahmad Subagyo' : 'Anggota Warga Desa';
      await loginAsMember(name: name, phone: cleanPhone);
      return true;
    }

    state = state.copyWith(
      isLoading: false,
      errorMessage: 'Nomor HP atau password tidak valid',
    );
    return false;
  }

  Future<void> logout() async {
    await _storage.clearToken();
    await _storage.saveRole('guest');
    state = const AuthState(
      isAuthenticated: false,
      isLoading: false,
      role: UserRole.guest,
      user: null,
    );
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
