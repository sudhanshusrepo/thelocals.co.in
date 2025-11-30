-- Storage Setup
-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true) ON CONFLICT DO NOTHING;

-- Policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Policies for service images
CREATE POLICY "Service images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'service-images' );
