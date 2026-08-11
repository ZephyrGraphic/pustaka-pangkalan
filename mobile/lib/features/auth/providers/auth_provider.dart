import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/constants/api_constants.dart';
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

  /// Parse role string from API response to UserRole enum
  UserRole _parseRole(String? roleStr) {
    if (roleStr == null) return UserRole.guest;
    final r = roleStr.toUpperCase();
    if (r == 'ADMIN' || r == 'SUPER_ADMIN' || r == 'LIBRARIAN') {
      return UserRole.admin;
    }
    if (r == 'USER' || r == 'MEMBER') {
      return UserRole.member;
    }
    return UserRole.guest;
  }

  /// Check stored token and restore session on app launch
  Future<void> checkAuthStatus() async {
    state = state.copyWith(isLoading: true);

    try {
      final token = await _storage.getToken();
      if (token == null || token.isEmpty) {
        state = const AuthState(isAuthenticated: false, isLoading: false, role: UserRole.guest);
        return;
      }

      // Verify token is still valid by calling /auth/me
      final response = await _api.dio.get(ApiConstants.me);
      if (response.statusCode == 200 && response.data['success'] == true) {
        final userData = response.data['data'];
        final user = User.fromJson(userData);
        final role = _parseRole(user.role);

        state = AuthState(
          isAuthenticated: true,
          isLoading: false,
          role: role,
          user: user,
        );
        return;
      }
    } catch (_) {
      // Token invalid or network error — clear and go guest
      await _storage.clearToken();
    }

    // Fallback: check saved role for offline support
    final savedRole = await _storage.getRole();
    if (savedRole != null && savedRole != 'guest') {
      state = AuthState(
        isAuthenticated: true,
        isLoading: false,
        role: savedRole == 'admin' ? UserRole.admin : UserRole.member,
      );
      return;
    }

    state = const AuthState(isAuthenticated: false, isLoading: false, role: UserRole.guest);
  }

  /// Login via backend API — POST /auth/login
  Future<bool> login(String phone, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final cleanPhone = phone.trim();
    final cleanPass = password.trim();

    if (cleanPhone.isEmpty || cleanPass.isEmpty) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Nomor HP dan password harus diisi',
      );
      return false;
    }

    try {
      final response = await _api.dio.post(
        ApiConstants.login,
        data: {
          'phone': cleanPhone,
          'password': cleanPass,
        },
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final data = response.data['data'];
        final token = data['token'] as String;
        final user = User.fromJson(data['user']);
        final role = _parseRole(user.role);

        // Save token & role to local storage
        await _storage.saveToken(token);
        await _storage.saveRole(role == UserRole.admin ? 'admin' : 'member');

        state = AuthState(
          isAuthenticated: true,
          isLoading: false,
          role: role,
          user: user,
        );
        return true;
      }

      state = state.copyWith(
        isLoading: false,
        errorMessage: response.data['message'] ?? 'Login gagal',
      );
      return false;
    } on DioException catch (e) {
      String errorMsg = 'Gagal terhubung ke server';

      if (e.response != null) {
        final data = e.response?.data;
        if (data is Map && data['message'] != null) {
          errorMsg = data['message'];
        }
      } else if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout) {
        errorMsg = 'Koneksi timeout — periksa jaringan internet Anda';
      } else if (e.type == DioExceptionType.connectionError) {
        errorMsg = 'Tidak dapat terhubung ke server — periksa jaringan';
      }

      state = state.copyWith(isLoading: false, errorMessage: errorMsg);
      return false;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Terjadi kesalahan tidak terduga',
      );
      return false;
    }
  }

  /// Register via backend API — POST /auth/register
  Future<bool> registerMember({
    required String name,
    required String nikOrPhone,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    if (name.isEmpty || nikOrPhone.isEmpty || password.isEmpty) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Semua kolom pendaftaran harus diisi',
      );
      return false;
    }

    if (password.length < 6) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Password minimal 6 karakter',
      );
      return false;
    }

    try {
      final response = await _api.dio.post(
        ApiConstants.register,
        data: {
          'name': name,
          'phone': nikOrPhone,
          'password': password,
        },
      );

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          response.data['success'] == true) {
        final data = response.data['data'];
        final token = data['token'] as String;
        final user = User.fromJson(data['user']);

        await _storage.saveToken(token);
        await _storage.saveRole('member');

        state = AuthState(
          isAuthenticated: true,
          isLoading: false,
          role: UserRole.member,
          user: user,
        );
        return true;
      }

      state = state.copyWith(
        isLoading: false,
        errorMessage: response.data['message'] ?? 'Registrasi gagal',
      );
      return false;
    } on DioException catch (e) {
      String errorMsg = 'Gagal terhubung ke server';

      if (e.response != null) {
        final data = e.response?.data;
        if (data is Map && data['message'] != null) {
          errorMsg = data['message'];
        }
      } else if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout) {
        errorMsg = 'Koneksi timeout — periksa jaringan internet Anda';
      }

      state = state.copyWith(isLoading: false, errorMessage: errorMsg);
      return false;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Terjadi kesalahan tidak terduga',
      );
      return false;
    }
  }

  /// Enter guest mode (no login required)
  Future<void> loginAsGuest() async {
    await _storage.clearToken();
    await _storage.saveRole('guest');
    state = const AuthState(
      isAuthenticated: false,
      isLoading: false,
      role: UserRole.guest,
      user: null,
    );
  }

  /// Logout — clear stored token and role
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
