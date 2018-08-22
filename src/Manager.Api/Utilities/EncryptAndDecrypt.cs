using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace RDSManagerAPI.Utilities
{
    public class EncryptAndDecrypt
    {
        public static string KeySecret = "9876543219876543"; //any random 16 digits, should match with encryption mechanism in ui
        public static string SaltSecret = "9513578524569512";  //any random 16 digits, should match with encryption mechanism in ui    

        public static string Decrypt(string cipherText)
        {
            try
            {

            
            var keybytes = Encoding.UTF8.GetBytes(KeySecret);
            var saltbytes = Encoding.UTF8.GetBytes(SaltSecret);

            var encrypted = Convert.FromBase64String(cipherText);
            var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, saltbytes);
            return string.Format(decriptedFromJavascript);
            }
            catch (Exception ex)
            {
                //TODO: Log the error
                return string.Empty;
            }
        }

        private static string DecryptStringFromBytes(byte[] encryptedText, byte[] key, byte[] salt)
        {
            if (encryptedText == null || encryptedText.Length <= 0)
            {
                throw new ArgumentNullException("Encrypted data not available");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("Key not supplied");
            }
            if (salt == null || salt.Length <= 0)
            {
                throw new ArgumentNullException("Salt not available");
            }

            string decrytedData = null;
            using (var rijAlgorithm = new RijndaelManaged())
            {
                rijAlgorithm.Mode = CipherMode.CBC;
                rijAlgorithm.Padding = PaddingMode.PKCS7;
                rijAlgorithm.FeedbackSize = 128;
                rijAlgorithm.Key = key;
                rijAlgorithm.IV = salt;

                var decryptor = rijAlgorithm.CreateDecryptor(rijAlgorithm.Key, rijAlgorithm.IV);

                using (var msDecrypt = new MemoryStream(encryptedText))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (var srDecrypt = new StreamReader(csDecrypt))
                        {
                            decrytedData = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return decrytedData;
        }

        public static string Encrypt(string textToEncyrpt)
        {
            Byte[] bytesToEncrypt = Encoding.UTF8.GetBytes(textToEncyrpt);

            var key = Encoding.UTF8.GetBytes(KeySecret);
            var salt = Encoding.UTF8.GetBytes(SaltSecret);
            byte[] encrytedData;

            using (var rijAlgorithm = new RijndaelManaged())
            {
                rijAlgorithm.Mode = CipherMode.CBC;
                rijAlgorithm.Padding = PaddingMode.PKCS7;
                rijAlgorithm.FeedbackSize = 128;
                rijAlgorithm.Key = key;
                rijAlgorithm.IV = salt;

                var encryptor = rijAlgorithm.CreateEncryptor(rijAlgorithm.Key, rijAlgorithm.IV);

                using (var msEncrypt = new MemoryStream())
                {
                    using (var csw = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        csw.Write(bytesToEncrypt, 0, bytesToEncrypt.Length);
                        csw.FlushFinalBlock();

                        msEncrypt.Position = 0;
                        byte[] encrypted = new byte[msEncrypt.Length];
                        msEncrypt.Read(encrypted, 0, encrypted.Length);
                        encrytedData = encrypted;
                    }
                }
            }
            return Convert.ToBase64String(encrytedData);
        }
    }
}