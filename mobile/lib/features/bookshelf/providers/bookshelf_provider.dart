import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/constants/api_constants.dart';
import '../../../shared/models/book.dart';
import '../../../shared/models/reading_progress.dart';
import '../../auth/providers/auth_provider.dart';

class BookshelfState {
  final bool isLoading;
  final List<ReadingProgressModel> activeReading;
  final List<Book> bookmarks;
  final String? errorMessage;

  const BookshelfState({
    this.isLoading = false,
    this.activeReading = const [],
    this.bookmarks = const [],
    this.errorMessage,
  });

  BookshelfState copyWith({
    bool? isLoading,
    List<ReadingProgressModel>? activeReading,
    List<Book>? bookmarks,
    String? errorMessage,
  }) {
    return BookshelfState(
      isLoading: isLoading ?? this.isLoading,
      activeReading: activeReading ?? this.activeReading,
      bookmarks: bookmarks ?? this.bookmarks,
      errorMessage: errorMessage,
    );
  }
}

class BookshelfNotifier extends StateNotifier<BookshelfState> {
  final ApiClient _api = ApiClient();
  final Ref ref;

  BookshelfNotifier(this.ref) : super(const BookshelfState()) {
    _init();
  }

  void _init() {
    final authState = ref.read(authProvider);
    if (authState.isAuthenticated && authState.role != UserRole.guest) {
      fetchBookshelfData();
    }
  }

  Future<void> fetchBookshelfData() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final progressRes = await _api.dio.get(ApiConstants.readingProgress);
      List<ReadingProgressModel> progressList = [];
      if (progressRes.statusCode == 200 && progressRes.data['success'] == true) {
        progressList = (progressRes.data['data'] as List)
            .map((e) => ReadingProgressModel.fromJson(e))
            .toList();
      }

      final bookmarkRes = await _api.dio.get(ApiConstants.bookmarks);
      List<Book> bookmarkList = [];
      if (bookmarkRes.statusCode == 200 && bookmarkRes.data['success'] == true) {
        bookmarkList = (bookmarkRes.data['data'] as List)
            .map((e) => Book.fromJson(e['content'] ?? e)) 
            .toList();
      }

      state = state.copyWith(
        isLoading: false,
        activeReading: progressList,
        bookmarks: bookmarkList,
      );
    } on DioException catch (_) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Gagal mengambil data rak buku. Periksa koneksi internet Anda.',
      );
    } catch (_) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Terjadi kesalahan sistem saat memuat rak buku.',
      );
    }
  }
}

final bookshelfProvider = StateNotifierProvider<BookshelfNotifier, BookshelfState>((ref) {
  // watch authProvider so if user logs in/out, bookshelf can re-initialize if needed
  ref.watch(authProvider);
  return BookshelfNotifier(ref);
});
